<?php
// Verificar si ya están definidas para evitar redefinición
if (!defined('BASE_URL')) {
    if ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_ADDR'] === '127.0.0.1') {
        // Modo desarrollo
        define('BASE_URL', 'http://localhost/backendRallyFotografico/');
        define('FRONTEND_URL', 'http://localhost:4200/');
        define('APP_ENV', 'development');
    } else {
        // Modo producción
        define('BASE_URL', 'https://expresscapturevz.wuaze.com/');
        define('FRONTEND_URL', 'https://expresscapturevz.wuaze.com/');
        define('APP_ENV', 'production');
    }
}
