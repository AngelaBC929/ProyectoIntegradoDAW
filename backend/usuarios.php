<?php
require 'cors.php';
require 'db.php';
require 'config.php';

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Fallo en la conexión a la base de datos"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' && isset($input['action'])) {
    $action = $input['action'];

    switch ($action) {

        // --- Crear usuario ---
        case 'create':
            try {
                if (!isset($input['name'], $input['lastName'], $input['email'], $input['username'], $input['password'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Faltan campos obligatorios"]);
                    exit;
                }

                // Verificar email y username únicos
                $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
                $stmt->execute([$input['email']]);
                if ($stmt->fetch()) {
                    echo json_encode(["error" => "El correo electrónico ya está en uso."]);
                    exit;
                }

                $stmt = $conn->prepare("SELECT id FROM usuarios WHERE username = ?");
                $stmt->execute([$input['username']]);
                if ($stmt->fetch()) {
                    echo json_encode(["error" => "El nombre de usuario ya está en uso."]);
                    exit;
                }

                $stmt = $conn->prepare("INSERT INTO usuarios (name, lastName, email, birthdate, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $input['name'],
                    $input['lastName'],
                    $input['email'],
                    $input['birthdate'] ?? null,
                    $input['username'],
                    password_hash($input['password'], PASSWORD_BCRYPT),
                    $input['role'] ?? 'user'
                ]);

                echo json_encode(["message" => "Usuario creado correctamente"]);

            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => $e->getMessage()]);
            }
            break;

        // --- Actualizar usuario ---
        case 'update':
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit;
            }

            $userId = $input['id'];
            $currentUserId = 14; // Simulado, cambia esto por ID real desde token si lo necesitas

            if ($userId == 14) {
                echo json_encode(["error" => "No puedes cambiar el rol del admin principal"]);
                exit;
            }

            if ($currentUserId != 14 && $input['role'] == 'admin') {
                echo json_encode(["error" => "Solo el admin principal puede asignar el rol de admin"]);
                exit;
            }

            try {
                $stmt = $conn->prepare("UPDATE usuarios SET name=?, lastName=?, email=?, username=?, role=? WHERE id=?");
                $stmt->execute([
                    $input['name'],
                    $input['lastName'],
                    $input['email'],
                    $input['username'],
                    $input['role'],
                    $userId
                ]);
                echo json_encode(["message" => "Usuario actualizado correctamente"]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => $e->getMessage()]);
            }
            break;

        // --- Eliminar usuario ---
        case 'delete':
            if (!isset($input['id'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit;
            }

            try {
                $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
                $stmt->execute([$input['id']]);

                if ($stmt->rowCount() > 0) {
                    echo json_encode(["message" => "Usuario eliminado correctamente"]);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Usuario no encontrado"]);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => $e->getMessage()]);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Acción no válida"]);
            break;
    }

    exit;
}

// --- GET: Obtener uno o todos los usuarios ---
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $userId = $_GET['id'];
        try {
            $stmt = $conn->prepare("SELECT id, name, lastName, email, username, role FROM usuarios WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Usuario no encontrado"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        try {
            $stmt = $conn->query("SELECT id, name, lastName, email, username, role FROM usuarios");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
} else if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}

