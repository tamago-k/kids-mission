FROM php:8.2-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql
    
WORKDIR /var/www
COPY . /var/www

RUN composer install --no-dev --optimize-autoloader

# サーバー起動（Render 用）
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]