FROM php:8.2-cli

WORKDIR /var/www

COPY composer.json composer.lock artisan ./
COPY bootstrap ./bootstrap
COPY routes ./routes

RUN composer install --no-dev --optimize-autoloader --no-interaction --verbose

COPY . .

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]