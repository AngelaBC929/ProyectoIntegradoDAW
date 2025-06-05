<?php
require 'cors.php';
require 'db.php';
require 'config.php';

// =========================
// Funciones reutilizables
// =========================

function usuarioYaInscrito($conn, $rallyId, $userId) {
    $sql = "SELECT COUNT(*) FROM inscripciones WHERE rallyId = ? AND userId = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$rallyId, $userId]);
    return $stmt->fetchColumn() > 0;
}

function fotosSubidas($conn, $rallyId, $userId) {
    $sql = "SELECT COUNT(*) FROM rally_fotos WHERE rallyId = ? AND userId = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$rallyId, $userId]);
    return (int)$stmt->fetchColumn();
}

function cancelarInscripcion($conn, $rallyId, $userId) {
    $conn->beginTransaction();
    try {
        $stmt = $conn->prepare("DELETE FROM inscripciones WHERE rallyId = ? AND userId = ?");
        $stmt->execute([$rallyId, $userId]);

        $stmtFotos = $conn->prepare("DELETE FROM rally_fotos WHERE rallyId = ? AND userId = ?");
        $stmtFotos->execute([$rallyId, $userId]);

        $conn->commit();
        return true;
    } catch (Exception $e) {
        $conn->rollBack();
        return false;
    }
}

function registrarInscripcion($conn, $rallyId, $userId) {
    $stmt = $conn->prepare("INSERT INTO inscripciones (rallyId, userId) VALUES (?, ?)");
    return $stmt->execute([$rallyId, $userId]);
}

function obtenerInscripciones($conn, $userId) {
    $sql = "SELECT r.id, r.title, r.start_date, r.end_date 
            FROM inscripciones i 
            JOIN rallies r ON i.rallyId = r.id 
            WHERE i.userId = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function ralliesConMasInscritos($conn, $limit = 5) {
    $sql = "
        SELECT r.id, r.title, COUNT(i.userId) AS inscritos
        FROM rallies r
        LEFT JOIN inscripciones i ON r.id = i.rallyId
        GROUP BY r.id
        ORDER BY inscritos DESC, r.start_date ASC
        LIMIT ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// =========================
// Manejo de solicitudes
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['action'])) {
        echo json_encode(['success' => false, 'message' => 'Acción requerida.']);
        exit;
    }

    $action = $data['action'];

    if ($action === 'inscribir' || $action === 'desinscribir') {
        if (!isset($data['rallyId'], $data['userId']) || 
            !is_numeric($data['rallyId']) || 
            !is_numeric($data['userId'])) {
            echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
            exit;
        }

        $rallyId = (int)$data['rallyId'];
        $userId = (int)$data['userId'];

        if ($action === 'inscribir') {
            if (usuarioYaInscrito($conn, $rallyId, $userId)) {
                echo json_encode(['success' => false, 'message' => 'Ya estás inscrito.']);
            } elseif (registrarInscripcion($conn, $rallyId, $userId)) {
                echo json_encode(['success' => true, 'message' => 'Inscripción exitosa.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al inscribirse.']);
            }
        } elseif ($action === 'desinscribir') {
            if (!usuarioYaInscrito($conn, $rallyId, $userId)) {
                echo json_encode(['success' => false, 'message' => 'No estás inscrito.']);
            } elseif (fotosSubidas($conn, $rallyId, $userId) >= 3) {
                echo json_encode(['success' => false, 'message' => 'No puedes cancelar si ya has subido 3 fotos.']);
            } elseif (cancelarInscripcion($conn, $rallyId, $userId)) {
                echo json_encode(['success' => true, 'message' => 'Inscripción cancelada.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al cancelar inscripción.']);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (isset($_GET['stats']) && $_GET['stats'] === 'top') {
        $topRallies = ralliesConMasInscritos($conn, 5);
        echo json_encode(['success' => true, 'topRallies' => $topRallies]);
        exit;
    }

    if (isset($_GET['rallyId'], $_GET['userId']) && is_numeric($_GET['rallyId']) && is_numeric($_GET['userId'])) {
        $count = fotosSubidas($conn, (int)$_GET['rallyId'], (int)$_GET['userId']);
        echo json_encode(['success' => true, 'count' => $count]);
    } elseif (isset($_GET['userId']) && is_numeric($_GET['userId'])) {
        $inscripciones = obtenerInscripciones($conn, (int)$_GET['userId']);
        echo json_encode(['success' => true, 'inscritos' => $inscripciones]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Parámetros inválidos.']);
    }




} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
