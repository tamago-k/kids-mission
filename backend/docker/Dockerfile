FROM php:8.2-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . /var/www

RUN composer install --no-dev --optimize-autoloader

# サーバー起動（Render 用）
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]