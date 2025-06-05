<?php
if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_ADDR'] == '127.0.0.1') {
    // Configuración local
    $host = "localhost";
    $dbname = "rally_fotografico";
    $username = "root";
    $password = "";

        // URL base local
    if (!defined('BASE_URL')) {
    define('BASE_URL', 'http://localhost/backendRallyFotografico/');
}
} else {
    // Configuración producción (InfinityFree)
    $host = "sql204.infinityfree.com";
    $dbname = "if0_39058586_rally_fotografico";
    $username = "if0_39058586";
    $password = "qXHaVucZ4wymD";
      // URL base en producción (wuaze)
    define('BASE_URL', 'https://expresscapturevz.wuaze.com/');
}

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $conn = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    // Manejo de errores de conexión
    header('Content-Type: application/json');
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

    // header('Content-Type: application/json');
    // if (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development') {
    //     echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    // } else {
    //     error_log("Error de conexión a la base de datos: " . $e->getMessage());
    //     echo json_encode(["error" => "Error de conexión a la base de datos."]);
    // }
    // exit;
    
?>
