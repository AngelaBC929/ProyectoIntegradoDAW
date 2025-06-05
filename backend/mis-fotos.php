<?php
require 'cors.php';
require 'db.php';
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Mostrar errores (solo para desarrollo)
if ($method === 'GET') {
    if (!isset($_GET['userId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el parámetro userId']);
        exit;
    }

    $userId = intval($_GET['userId']);

    try {
        $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE userId = ?");
        $stmt->execute([$userId]);
        $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['fotos' => $fotos]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener las fotos']);
    }

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['userId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el parámetro userId']);
        exit;
    }

    $userId = intval($input['userId']);

    try {
        $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE userId = ?");
        $stmt->execute([$userId]);
        $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['fotos' => $fotos]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener las fotos']);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>
