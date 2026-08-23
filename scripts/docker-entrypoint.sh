#!/usr/bin/env sh
set -eu

APP_ROOT="/var/www/html"

mkdir -p \
  "$APP_ROOT/database" \
  "$APP_ROOT/storage/app/public" \
  "$APP_ROOT/storage/framework/cache" \
  "$APP_ROOT/storage/framework/sessions" \
  "$APP_ROOT/storage/framework/views" \
  "$APP_ROOT/storage/logs" \
  "$APP_ROOT/bootstrap/cache"

touch "$APP_ROOT/database/database.sqlite"

chown -R www-data:www-data \
  "$APP_ROOT/storage" \
  "$APP_ROOT/bootstrap/cache" \
  "$APP_ROOT/database"

if [ ! -f "$APP_ROOT/.env" ]; then
  echo "Missing .env file in container. Mount or provide one before starting the app." >&2
  exit 1
fi

if ! grep -Eq '^APP_KEY=base64:' "$APP_ROOT/.env"; then
  php artisan key:generate --force --no-interaction
fi

php artisan config:cache --no-interaction
php artisan view:cache --no-interaction
php artisan migrate --force --no-interaction

exec "$@"
