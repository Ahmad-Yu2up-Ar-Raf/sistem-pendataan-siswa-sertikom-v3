# Dockerfile — Laravel 12 + FrankenPHP + Octane + Vite (React)
FROM dunglas/frankenphp:php8.2-fpm

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev build-essential ca-certificates \
    nodejs npm \
  && rm -rf /var/lib/apt/lists/*

# composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# enable corepack for pnpm
RUN npm install -g corepack && corepack enable

# copy app
COPY . /app

# install php deps (prefer to cache vendor in CI, but this is simple)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Node: use corepack/pnpm if pnpm-lock exists; fallback npm
RUN if [ -f pnpm-lock.yaml ]; then corepack prepare pnpm@9.15.9 --activate || corepack prepare pnpm@9 --activate; fi
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile || npm ci; else npm ci; fi

# build frontend (Vite)
RUN if [ -f package.json ]; then pnpm run build || npm run build || true; fi

# Laravel optimizations (consider running migrations at release, not build)
RUN php artisan key:generate --force || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true
RUN php artisan storage:link || true

EXPOSE 8000

# Run Octane with FrankenPHP
# NOTE: DO NOT pass secrets here; set env in Dockploy UI
ENTRYPOINT ["php","artisan","octane:frankenphp","--host=0.0.0.0","--port=8000","--workers=auto","--max-requests=500"]
