# ============================================================================
# STAGE 1: Frontend Builder (Node.js + pnpm)
# ============================================================================
FROM node:18-alpine AS frontend-builder

WORKDIR /build

# Enable corepack & setup pnpm
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Copy package files for cache optimization
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend assets
RUN pnpm run build

# ============================================================================
# STAGE 2: PHP Dependencies (Composer)
# ============================================================================
FROM composer:2.7 AS backend-builder

WORKDIR /build

# Copy composer files only for better caching
COPY composer.json composer.lock ./

# Install production dependencies (no dev packages)
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction \
    --ignore-platform-reqs

# Copy application source
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload \
    --optimize \
    --classmap-authoritative \
    --no-dev

# ============================================================================
# STAGE 3: Final Runtime (FrankenPHP + PHP 8.3)
# ============================================================================
FROM dunglas/frankenphp:1-php8.3-alpine

LABEL maintainer="Ahmad Yu2up Ar Raf"
LABEL description="Laravel Octane with FrankenPHP - Production (Database-only)"

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    icu-dev \
    git \
    curl \
    bash \
    supervisor \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        zip \
        gd \
        bcmath \
        opcache \
        pcntl \
        intl \
        exif \
    && rm -rf /tmp/pear

# Configure PHP for production
COPY --chown=www-data:www-data <<'EOF' /usr/local/etc/php/conf.d/99-production.ini
; === PHP Production Settings ===
expose_php = Off
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /proc/self/fd/2
memory_limit = 512M
max_execution_time = 60
upload_max_filesize = 20M
post_max_size = 25M

; === OPcache Optimization ===
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 0
opcache.save_comments = 1
opcache.fast_shutdown = 1
opcache.jit = tracing
opcache.jit_buffer_size = 100M

; === Realpath Cache ===
realpath_cache_size = 4096K
realpath_cache_ttl = 600
EOF

# Set working directory
WORKDIR /app

# Copy application from builders
COPY --from=backend-builder --chown=www-data:www-data /build /app
COPY --from=frontend-builder --chown=www-data:www-data /build/public/build /app/public/build

# Create required directories with correct permissions
RUN mkdir -p \
    storage/framework/{sessions,views,cache,testing} \
    storage/logs \
    storage/app/public \
    bootstrap/cache \
    && chown -R www-data:www-data \
        storage \
        bootstrap/cache \
        public \
    && chmod -R 775 \
        storage \
        bootstrap/cache

# Configure Supervisor for Queue Workers
COPY --chown=root:root <<'EOF' /etc/supervisor/conf.d/laravel-worker.conf
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /app/artisan queue:work --sleep=3 --tries=3 --max-time=3600 --timeout=300
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stopwaitsecs=3600
EOF

# Create entrypoint script
COPY --chown=www-data:www-data <<'EOF' /usr/local/bin/entrypoint.sh
#!/bin/bash
set -e

echo "🚀 Starting Laravel Octane with FrankenPHP..."
echo "Environment: ${APP_ENV:-production}"

# Wait for database to be ready
if [ -n "$DB_HOST" ]; then
    echo "⏳ Waiting for database at $DB_HOST:${DB_PORT:-5432}..."
    timeout 60 bash -c 'until nc -z $DB_HOST ${DB_PORT:-5432}; do sleep 1; done' || echo "⚠️ Database timeout (continuing anyway)"
fi

# Run migrations (only if enabled)
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "🔄 Running database migrations..."
    php artisan migrate --force --no-interaction --isolated || {
        echo "❌ Migration failed!"
        exit 1
    }
fi

# Create storage link if not exists
if [ ! -L /app/public/storage ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link --force || true
fi

# Optimize Laravel for production
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Start supervisor for queue workers (in background)
if [ "${ENABLE_QUEUE_WORKER:-false}" = "true" ]; then
    echo "👷 Starting queue workers via supervisor..."
    /usr/bin/supervisord -c /etc/supervisor/supervisord.conf &
fi

# Start Octane with FrankenPHP
echo "✅ Starting Octane server on port ${PORT:-8000}..."
exec php artisan octane:frankenphp \
    --host=0.0.0.0 \
    --port="${PORT:-8000}" \
    --admin-port="${ADMIN_PORT:-2019}" \
    --workers="${OCTANE_WORKERS:-auto}" \
    --max-requests="${OCTANE_MAX_REQUESTS:-500}" \
    --watch
EOF

RUN chmod +x /usr/local/bin/entrypoint.sh

# Switch to non-root user
USER www-data

# Expose ports
EXPOSE 8000 2019

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
