FROM php:8.4-fpm-alpine
# ↑ Image officielle PHP 8.2 avec PHP-FPM (gestionnaire de processus PHP)
# Installer les outils système et les extensions PHP nécessaires à Symfony
RUN apk add --no-cache git unzip && \
docker-php-ext-install pdo pdo_mysql
# ↑ 'pdo' et 'pdo_mysql' permettent à PHP de parler à MySQL
# ↑ Le backslash \ permet d'écrire une commande sur plusieurs lignes
# Copier Composer depuis son image officielle (pas besoin de l'installer manuellement)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader
# ↑ '--no-dev' : n'installe pas les outils de développement (plus léger en prod)
EXPOSE 9000
CMD ["php-fpm"]