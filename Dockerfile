FROM php:8.2-apache

# Installation des dépendances système et PHP
RUN apt-get update && apt-get install -y \
    libpng-dev zlib1g-dev libxml2-dev libzip-dev zip unzip \
    && docker-php-ext-install gd pdo_mysql mysqli zip

# Configuration d'Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN a2enmod rewrite

COPY . /var/www/html
WORKDIR /var/www/html

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# On donne les droits au serveur web
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache