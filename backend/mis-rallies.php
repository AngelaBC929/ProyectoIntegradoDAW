<?php
require 'cors.php';
require 'db.php';
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (!isset($_GET['userId'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el parámetro userId']);
        exit;
    }

    $userId = intval($_GET['userId']);

    try {
        $stmt = $conn->prepare("
            SELECT r.* 
            FROM rallies r 
            INNER JOIN inscripciones i ON r.id = i.rallyId 
            WHERE i.userId = ?
        ");
        $stmt->execute([$userId]);
        $rallies = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['rallies' => $rallies]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
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
        $stmt = $conn->prepare("
            SELECT r.* 
            FROM rallies r 
            INNER JOIN inscripciones i ON r.id = i.rallyId 
            WHERE i.userId = ?
        ");
        $stmt->execute([$userId]);
        $rallies = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['rallies' => $rallies]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>
