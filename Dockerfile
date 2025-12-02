# Dockerfile — Laravel 12 + FrankenPHP + Octane + Vite (React)
FROM dunglas/frankenphp:php8.2-fpm

WORKDIR /app

# minimal system deps for build
RUN apt-get update && apt-get install -y \
    git curl unzip zip libzip-dev build-essential ca-certificates \
    gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# composer (installer)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# node via NodeSource (debian base) — ensures node/npm available (for corepack)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g corepack \
  && corepack enable

# copy app (use .dockerignore to speed up)
COPY . /app

# install php deps
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# prepare pnpm via corepack, install node deps
RUN if [ -f pnpm-lock.yaml ]; then corepack prepare pnpm@9.15.9 --activate || corepack prepare pnpm@9 --activate; fi
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile || npm ci; else npm ci; fi

# build frontend (vite)
RUN if [ -f package.json ]; then pnpm run build || npm run build || true; fi

# Laravel optimizations (prefer to run migrate in release hook rather than build)
RUN php artisan key:generate --force || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true
RUN php artisan storage:link || true

EXPOSE 8000

# Start Octane w/ FrankenPHP — ideally tune workers in runtime/service config
ENTRYPOINT ["php","artisan","octane:frankenphp","--host=0.0.0.0","--port=8000","--workers=auto","--max-requests=500"]
