#!/usr/bin/env sh
set -eu

cd /var/www/html

# Reset stale package cache generated from a different dependency set.
rm -f bootstrap/cache/packages.php bootstrap/cache/services.php

# Install PHP dependencies when vendor volume is empty or missing Sanctum.
if [ ! -f /var/www/html/vendor/autoload.php ] || [ ! -f /var/www/html/vendor/laravel/sanctum/src/SanctumServiceProvider.php ]; then
  echo "Installing Composer dependencies..."
  composer install --optimize-autoloader --no-interaction --no-dev --no-scripts
fi

# Ensure writable runtime dirs.
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Rebuild package manifest for current dependency graph.
php artisan package:discover --ansi --no-interaction >/dev/null 2>&1 || true

# Generate application key if missing.
if ! php -r "exit(empty(getenv('APP_KEY')) ? 0 : 1);"; then
  php artisan key:generate --force >/dev/null 2>&1 || true
fi

# Wait for database availability before migration.
attempts=0
until php artisan migrate --force --no-interaction; do
  attempts=$((attempts + 1))
  if [ "$attempts" -ge 30 ]; then
    echo "Database is not ready after 30 attempts, exiting."
    exit 1
  fi
  echo "Waiting for database... attempt ${attempts}/30"
  sleep 2
done

echo "Seeding database..."
php artisan db:seed --force --no-interaction

exec apache2-foreground
