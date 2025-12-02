FROM dunglas/frankenphp:php8.2-fpm

WORKDIR /app

# system deps
RUN apt-get update && apt-get install -y \
    git curl unzip zip libzip-dev build-essential ca-certificates gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# node + corepack (pnpm)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g corepack \
  && corepack enable

COPY . /app

# PHP deps
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

# Node deps + build
RUN if [ -f pnpm-lock.yaml ]; then corepack prepare pnpm@9.15.9 --activate || true; fi
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile || npm ci; else npm ci; fi
RUN if [ -f package.json ]; then pnpm run build || npm run build || true; fi

# Laravel optimizations (do migrations in release hook)
RUN php artisan key:generate --force || true
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true
RUN php artisan storage:link || true

EXPOSE 8000

ENTRYPOINT ["php","artisan","octane:frankenphp","--host=0.0.0.0","--port=8000","--workers=auto","--max-requests=500"]
