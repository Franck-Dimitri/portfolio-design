# On passe sur PHP 8.4 pour satisfaire les exigences de Laravel 13 et Symfony 8
FROM php:8.4-apache

# Installation des dépendances système (on ajoute libicu-dev pour l'internationalisation, souvent requise)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    zlib1g-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl gd pdo_mysql mysqli zip

# Configuration d'Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN a2enmod rewrite

# Copie du projet
COPY . /var/www/html
WORKDIR /var/www/html

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# On ignore les restrictions de plateforme si besoin, mais avec PHP 8.4 ça devrait passer tout seul
RUN composer install --no-dev --optimize-autoloader

# Droits d'accès
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache