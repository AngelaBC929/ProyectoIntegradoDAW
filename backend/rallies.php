<?php
require 'cors.php';
require 'db.php';
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

// Mostrar errores (solo para desarrollo)
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM rallies WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: ["error" => "Rally no encontrado"]);

        } elseif (isset($_GET['userId'])) {
            $stmt = $conn->prepare("SELECT rally_id as id FROM inscripciones WHERE user_id = ?");
            $stmt->execute([$_GET['userId']]);
            echo json_encode(["inscritos" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);

        } else {
            $stmt = $conn->prepare("SELECT * FROM rallies ORDER BY start_date ASC");
            $stmt->execute();
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

        // POST: Crear, actualizar o eliminar rally
    case 'POST':
        $action = $input['action'] ?? 'create';

        if ($action === 'create') {
            if (!isset($input['title'], $input['start_date'], $input['end_date'], $input['created_by'])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos obligatorios"]);
                exit;
            }

            if (strtotime($input['end_date']) < strtotime($input['start_date'])) {
                http_response_code(400);
                echo json_encode(["error" => "La fecha de finalización no puede ser anterior a la de inicio"]);
                exit;
            }

            $adminCheck = $conn->prepare("SELECT role FROM usuarios WHERE id = ?");
            $adminCheck->execute([$input['created_by']]);
            $usuario = $adminCheck->fetch(PDO::FETCH_ASSOC);

            if (!$usuario || $usuario['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(["error" => "Solo los administradores pueden crear rallies"]);
                exit;
            }

            $dupCheck = $conn->prepare("SELECT id FROM rallies WHERE title = ? AND start_date = ?");
            $dupCheck->execute([$input['title'], $input['start_date']]);
            if ($dupCheck->rowCount() > 0) {
                http_response_code(409);
                echo json_encode(["error" => "Ya existe un rally con ese título y fecha de inicio"]);
                exit;
            }

            try {
                $stmt = $conn->prepare("
                    INSERT INTO rallies (title, description, start_date, end_date, location, theme, created_by) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $input['title'],
                    $input['description'] ?? '',
                    $input['start_date'],
                    $input['end_date'],
                    $input['location'] ?? '',
                    $input['theme'] ?? '',
                    $input['created_by']
                ]);

                $newId = $conn->lastInsertId();
                $nuevoRally = [
                    "id" => (int)$newId,
                    "title" => $input['title'],
                    "description" => $input['description'] ?? '',
                    "start_date" => $input['start_date'],
                    "end_date" => $input['end_date'],
                    "location" => $input['location'] ?? '',
                    "theme" => $input['theme'] ?? '',
                    "created_by" => $input['created_by']
                ];

                http_response_code(201);
                echo json_encode(["message" => "Rally creado correctamente", "rally" => $nuevoRally]);

            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(["error" => "Error en la base de datos: " . $e->getMessage()]);
            }

        } elseif ($action === 'update') {
            if (!isset($input['id'])) {
                echo json_encode(["error" => "ID requerido para actualizar"]);
                exit;
            }

            if (strtotime($input['end_date']) < strtotime($input['start_date'])) {
                echo json_encode(["error" => "La fecha de finalización no puede ser anterior a la de inicio"]);
                exit;
            }

            try {
                $stmt = $conn->prepare("UPDATE rallies SET title=?, description=?, start_date=?, end_date=?, location=?, theme=? WHERE id=?");
                $stmt->execute([
                    $input['title'],
                    $input['description'] ?? '',
                    $input['start_date'],
                    $input['end_date'],
                    $input['location'] ?? '',
                    $input['theme'] ?? '',
                    $input['id']
                ]);
                echo json_encode(["message" => "Rally actualizado"]);
            } catch (PDOException $e) {
                echo json_encode(["error" => $e->getMessage()]);
            }

        } elseif ($action === 'delete') {
            if (!isset($input['id'])) {
                echo json_encode(["error" => "ID requerido para eliminar"]);
                exit;
            }

            try {
                $stmt = $conn->prepare("DELETE FROM rallies WHERE id = ?");
                $stmt->execute([$input['id']]);
                echo json_encode(["message" => "Rally eliminado"]);
            } catch (PDOException $e) {
                echo json_encode(["error" => $e->getMessage()]);
            }

        } else {
            echo json_encode(["error" => "Acción POST no reconocida"]);
        }
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
?>
