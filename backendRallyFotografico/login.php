<?php
require 'cors.php';
require 'db.php';
require 'config.php';
header('Content-Type: application/json');
// Mostrar errores (solo para desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Manejo de errores como JSON
set_error_handler(function ($severity, $message, $file, $line) {
    http_response_code(500);
    echo json_encode(['error' => "PHP Error: $message"]);
    exit;
});

// Leer input JSON solo una vez
$input = json_decode(file_get_contents('php://input'), true);

// Soporte para métodos simulados (por si se usa más adelante)
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($input['_method'])) {
    $method = strtoupper($input['_method']);
}

// --- GET: Obtener todos los usuarios ---
if ($method === 'GET' && !isset($_GET['id'])) {
    $stmt = $conn->query("SELECT id, name, lastName, email, role FROM usuarios");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($usuarios);
    exit;
}

// --- GET con ID: Obtener usuario específico ---
if ($method === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $stmt = $conn->prepare("SELECT id, name, lastName, email, role FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
    exit;
}

// --- POST: Login de usuario ---
if ($method === 'POST') {
    if (!$input || !isset($input['username'], $input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos de entrada inválidos']);
        exit;
    }

    $username = $input['username'];
    $password = $input['password'];

    try {
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE BINARY username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Este usuario no está registrado. ¿Deseas registrarte?']);
            exit;
        }

        if (password_verify($password, $user['password'])) {
            // Generar token simulado
            // $fakeToken = base64_encode($user['username'] . ':' . $user['id'] . ':' . time());
            $fakeToken = bin2hex(random_bytes(32));


            echo json_encode([
                'token' => $fakeToken,
                'role' => $user['role'],
                'username' => $user['username'],
                'id' => $user['id'],
                'name' => $user['name'],
                'lastName' => $user['lastName']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Contraseña incorrecta, inténtalo de nuevo']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en el servidor: ' . $e->getMessage()]);
    }

    exit;
}
