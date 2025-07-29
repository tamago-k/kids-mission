FROM php:8.2-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN apt-get update && apt-get install -y libpq-dev libzip-dev unzip \
    && docker-php-ext-install pdo_pgsql zip

WORKDIR /var/www

COPY composer.json composer.lock artisan ./
COPY bootstrap ./bootstrap

RUN composer install --no-dev --optimize-autoloader --no-interaction --verbose

COPY . .

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]