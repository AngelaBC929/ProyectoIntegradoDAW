<?php
ini_set('display_errors', 0); // Desactivar errores en producción
ini_set('log_errors', 1); // Activar log de errores
ini_set('error_log', 'error.log'); // Archivo de log de errores
error_reporting(E_ALL);
ob_start();

require 'cors.php';
require 'db.php';
require 'config.php';

$contentType = $_SERVER["CONTENT_TYPE"] ?? '';

if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents("php://input");
    $jsonData = json_decode($rawInput, true);
    if (is_array($jsonData)) {
        foreach ($jsonData as $key => $value) {
            if (!isset($_POST[$key])) {
                $_POST[$key] = $value;
            }
        }
    }
}


// Fusionar datos POST tradicionales con JSON (sin sobreescribir valores de $_POST si existen)
if (is_array($jsonData)) {
    foreach ($jsonData as $key => $value) {
        if (!isset($_POST[$key])) {
            $_POST[$key] = $value;
        }
    }
}

// Dispatcher de acciones POST
// Acciones especiales para POST (por limitación de Wuaze-InfinityFree)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    error_log("Contenido de \$_POST: " . print_r($_POST, true));
error_log("Valor de action: " . $action);

    switch ($action) {
        case 'upload':
            handleUpload($conn);
            break;
        case 'vote':
            handleVote($conn);
            break;
        case 'approve_or_reject':
            handleApproveOrReject($conn);
            break;
        case 'edit':
            handleEdit($conn);
            break;
        case 'delete':
            handleDelete($conn);
            break;
        default:
            responseError('Acción no válida', 400);
    }
    exit;
}

// Dispatcher de acciones GET
// Acciones por GET (sin restricciones en Wuaze-InfinityFree)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    switch ($action) {
        case 'getUserPhotosActuales':
            handleGetFotosUsuarioActuales($conn);
            break;
        case 'getByUser':
            handleGetFotosPorUsuario($conn);
            break;
        case 'getAllPhotos':
            handleGetAllPhotos($conn);
            break;
        case 'getApprovedPhotos':
            handleGetApprovedPhotos($conn);
            break;
        case 'getApprovedPhotosByUser':
            handleGetApprovedPhotosByUser($conn);
            break;
        case 'checkAprobadas':
            handleCheckAprobadas($conn);
            break;
        default:
            // Lógica alternativa cuando no hay 'action'
            if (isset($_GET['userId'], $_GET['rallyId'])) {
                handleGetUserPhotos($conn);
            } elseif (isset($_GET['rallyId'])) {
                handleGetRallyPhotos($conn);
            } else {
                responseError('Faltan parámetros', 400);
            }
            break;
    }
    exit;
}

// if ($method === 'GET') {
//     if (isset($_GET['action'])) {
//         switch ($_GET['action']) {
//             case 'fotos_usuario_actuales':
//                 handleGetFotosUsuarioActuales();
//                 break;
//             case 'fotos_usuario':
//                 handleGetFotosPorUsuario();
//                 break;
//             case 'user_photos':
//                 handleGetUserPhotos();
//                 break;
//             case 'rally_photos':
//                 handleGetRallyPhotos();
//                 break;
//             case 'all_photos':
//                 handleGetAllPhotos();
//                 break;
//             case 'approved_photos':
//                 handleGetApprovedPhotos();
//                 break;
//             default:
//                 echo json_encode(['error' => 'Acción GET no válida']);
//         }
//     } else {
//         echo json_encode(['error' => 'Falta acción en GET']);
//     }
// }



// Funciones de utilidad
function responseJson($data, $status = 200)
{
    http_response_code($status);
    ob_clean();
    echo json_encode($data);
}

function responseError($message, $status = 400)
{
    responseJson(['error' => $message], $status);
    exit;
}


/** Action Handlers */
function handleUpload($conn)
{
    // Parámetros básicos
    if (empty($_FILES['photo']) || !isset($_POST['userId'], $_POST['rallyId'])) {
        responseError('Faltan parámetros');
    }
    $userId = intval($_POST['userId']);
    $rallyId = intval($_POST['rallyId']);


    // Tamaño máximo 5MB
    if ($_FILES['photo']['size'] > 10 * 1024 * 1024) {
        responseError('El archivo es demasiado grande');
    }

    // Validar MIME
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES['photo']['tmp_name']);
    $allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($mime, $allowed)) {
        responseError('Tipo de archivo no permitido (MIME)');
    }

    // Validar inscripción
    $stmt = $conn->prepare("SELECT 1 FROM inscripciones WHERE userId=? AND rallyId=?");
    $stmt->execute([$userId, $rallyId]);
    if (!$stmt->fetch()) {
        responseError('Usuario no inscrito en el rally', 403);
    }

    // Límite de fotos por usuario
    $stmt = $conn->prepare("SELECT COUNT(*) FROM rally_fotos WHERE userId=? AND rallyId=?");
    $stmt->execute([$userId, $rallyId]);
    if ($stmt->fetchColumn() >= 3) {
        responseError('Límite de fotos alcanzado');
    }

    // Crear directorio si no existe
    $dir = 'uploads/';
    if (!file_exists($dir))
        mkdir($dir, 0755, true);
    // Preparar nombre de archivo
    $orig = pathinfo($_FILES['photo']['name'], PATHINFO_FILENAME);
    $clean = preg_replace('/[^a-zA-Z0-9_-]/', '_', $orig);
    $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $base = "user{$userId}_rally{$rallyId}_{$clean}";
    $file = "{$base}.{$ext}";
    $path = $dir . $file;
    $i = 1;
    while (file_exists($path)) {
        $file = "{$base}_{$i}.{$ext}";
        $path = $dir . $file;
        $i++;
    }

    // Redimensionar y guardar imagen
    $tmpPath = $_FILES['photo']['tmp_name'];
    if (!resizeAndSaveImage($tmpPath, $path, $mime)) {
        responseError('Error al procesar y guardar la imagen', 500);
    }
// Guardar en BD SOLO el nombre del archivo (ruta relativa)
$url = $path; // Esto ya contiene algo como: "uploads/user5_rally7_foto.jpg"

try {
    $title = $_POST['title'] ?? 'Sin título';
    $stmt = $conn->prepare("INSERT INTO rally_fotos (rallyId, userId, photo_url, title, status) VALUES (?, ?, ?, ?, 'pendiente')");
    $stmt->execute([$rallyId, $userId, $url, $title]);

    responseJson(['success' => true, 'url' => $url]);  // Puedes devolverla así al frontend también
} catch (PDOException $e) {
    responseError('Error BD: ' . $e->getMessage(), 500);
}

}
// Redimensionar y guardar imagen
function resizeAndSaveImage($sourcePath, $destPath, $mime, $maxWidth = 1920, $maxHeight = 1080)
{
    switch ($mime) {
        case 'image/jpeg':
            $srcImg = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $srcImg = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $srcImg = imagecreatefromgif($sourcePath);
            break;
        default:
            return false;
    }

    if (!$srcImg) return false;

    $width = imagesx($srcImg);
    $height = imagesy($srcImg);

    // Escalar proporcionalmente
    $scale = min($maxWidth / $width, $maxHeight / $height, 1); // No ampliar si es más pequeña
    $newWidth = (int)($width * $scale);
    $newHeight = (int)($height * $scale);

    $dstImg = imagecreatetruecolor($newWidth, $newHeight);

    // Preservar transparencia en PNG y GIF
    if ($mime === 'image/png' || $mime === 'image/gif') {
        imagecolortransparent($dstImg, imagecolorallocatealpha($dstImg, 0, 0, 0, 127));
        imagealphablending($dstImg, false);
        imagesavealpha($dstImg, true);
    }

    imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // Guardar imagen redimensionada
    switch ($mime) {
        case 'image/jpeg':
            $success = imagejpeg($dstImg, $destPath, 85); // Calidad
            break;
        case 'image/png':
            $success = imagepng($dstImg, $destPath, 6);   // Compresión 0-9
            break;
        case 'image/gif':
            $success = imagegif($dstImg, $destPath);
            break;
        default:
            $success = false;
    }

    imagedestroy($srcImg);
    imagedestroy($dstImg);
    return $success;
}

//Votación
function handleVote($conn) {
    // $userId = $_POST['userId'] ?? null;
    // $photoId = $_POST['photo_id'] ?? null;

    $userId = isset($_POST['userId']) ? intval($_POST['userId']) : null;
    $photoId = isset($_POST['photo_id']) ? intval($_POST['photo_id']) : null;


    if (!$userId || !$photoId) {
        responseError('Faltan parámetros.', 400);
    }

    try {
        $stmt = $conn->prepare("INSERT INTO votos (userId, photo_id, voto) VALUES (?, ?, 1)");
        $stmt->execute([$userId, $photoId]);

        // Actualizar votos
        $updateStmt = $conn->prepare("UPDATE rally_fotos SET votos = votos + 1 WHERE id = ?");
        $updateStmt->execute([$photoId]);

        responseJson(['success' => true, 'message' => 'Voto registrado correctamente']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            responseError('Ya has votado esta foto.', 409);
        } else {
            responseError('Error BD: ' . $e->getMessage(), 500);
        }
    }
}


// Aprobación/Rechazo
function handleApproveOrReject($conn)
{
    // Leer el input JSON
    $data = json_decode(file_get_contents('php://input'), true);

    // Validar datos
    if (!isset($data['photo_id'], $data['status']) || !in_array($data['status'], ['aprobada', 'rechazada'])) {
        responseError('Parámetros inválidos');
    }

    $id = intval($data['photo_id']);
    $s = $data['status'];

    try {
        // Ejecutar la actualización
        $stmt = $conn->prepare("UPDATE rally_fotos SET status=? WHERE id=?");
        $stmt->execute([$s, $id]);
        responseJson(['success' => true, 'message' => 'Estado actualizado']);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}

// Obtener fotos aprobadas
// Obtener fotos aprobadas con paginación
function handleGetApprovedPhotos($conn)
{
    try {
        // Obtener los parámetros de la paginación
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100; // Número de fotos por página
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0; // Desplazamiento

        // Consulta para obtener el total de fotos aprobadas
        $countStmt = $conn->prepare("SELECT COUNT(*) AS total FROM rally_fotos WHERE status = 'aprobada'");
        $countStmt->execute();
        $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
        $totalPhotos = $countResult['total'];

        // Consulta para obtener las fotos aprobadas con paginación
        $stmt = $conn->prepare("
            SELECT 
                rf.id, 
                rf.photo_url, 
                rf.title, 
                rf.votos, 
                rf.rallyId AS rally_id,
                r.title AS rally_title, 
                r.start_date AS rally_start_date, 
                r.end_date AS rally_end_date,
                u.username AS autor
            FROM rally_fotos rf
            JOIN rallies r ON rf.rallyId = r.id
            JOIN usuarios u ON rf.userId = u.id
            WHERE rf.status = 'aprobada'
            ORDER BY rf.votos DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->bindValue(2, $offset, PDO::PARAM_INT);
        $stmt->execute();
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los resultados y el total para paginación
        responseJson([
            'photos' => $photos,
            'total' => $totalPhotos
        ]);
    } catch (PDOException $e) {
        responseError('Error al obtener las fotos aprobadas: ' . $e->getMessage(), 500);
    }
}

function handleGetApprovedPhotosByUser($conn) {
    $userId = intval($_GET['userId'] ?? 0);
    if ($userId <= 0) {
        responseError('ID de usuario inválido', 400);
        return;
    }

    try {
        $stmt = $conn->prepare("
            SELECT rallyId
            FROM rally_fotos
            WHERE userId = ? AND status = 'aprobada'
        ");
        $stmt->execute([$userId]);
        $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convertimos el resultado en un array de rallyId
        $rallyIds = array_column($fotos, 'rallyId');
        responseJson(['ralliesConFotoAprobada' => $rallyIds]);
    } catch (PDOException $e) {
        responseError('Error al obtener las fotos aprobadas del usuario: ' . $e->getMessage(), 500);
    }
}

// Verificar si hay fotos aprobadas de un usuario en un rally
function handleCheckAprobadas($conn) {
    $userId = intval($_GET['userId'] ?? 0);
    $rallyId = intval($_GET['rallyId'] ?? 0);

    if ($userId <= 0 || $rallyId <= 0) {
        responseJson(['aprobadas' => false]); // datos inválidos => asumimos que no hay aprobadas
        return;
    }

    try {
        $stmt = $conn->prepare("
            SELECT COUNT(*) AS total 
            FROM rally_fotos 
            WHERE userId = ? AND rallyId = ? AND status = 'aprobada'
        ");
        $stmt->execute([$userId, $rallyId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $hayAprobadas = $result['total'] > 0;

        responseJson(['aprobadas' => $hayAprobadas]);
    } catch (PDOException $e) {
        responseJson(['aprobadas' => false]); // en caso de error también devolvemos false
    }
}


// Función para devolver una respuesta exitosa
function responseSuccess($data)
{
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'data' => $data]);
    exit;
}




// Obtener todas las fotos (sin filtro)
function handleGetAllPhotos($conn)
{
    try {
        $stmt = $conn->prepare("
            SELECT rf.*, u.name AS user_name, r.title AS rally_name
            FROM rally_fotos rf
            JOIN usuarios u ON rf.userId = u.id
            JOIN rallies r ON rf.rallyId = r.id
        ");
        $stmt->execute();
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        responseJson(['photos' => $photos]);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}


// function handleEdit($conn)

// {
//     if (!isset($_POST['userId'], $_POST['photo_id'], $_POST['title'])) {
//         responseError('Faltan parámetros');
//     }

//     $userId = intval($_POST['userId']);
//     $photoId = intval($_POST['photo_id']);
//     $title = $_POST['title'];

//     // Verificar permisos
//     $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE id=? AND userId=?");
//     $stmt->execute([$photoId, $userId]);
//     $foto = $stmt->fetch(PDO::FETCH_ASSOC);

//     if (!$foto) {
//         responseError('Sin permisos', 403);
//     }

//     $newUrl = $foto['photo_url']; // Por si no cambia la imagen

//     // Si se subió una nueva imagen
//     if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
//         // Validaciones similares a handleUpload
//         if ($_FILES['photo']['size'] > 5 * 1024 * 1024) {
//             responseError('El archivo es demasiado grande');
//         }

//         $finfo = new finfo(FILEINFO_MIME_TYPE);
//         $mime = $finfo->file($_FILES['photo']['tmp_name']);
//         $allowed = ['image/jpeg', 'image/png', 'image/gif'];
//         if (!in_array($mime, $allowed)) {
//             responseError('Tipo de archivo no permitido');
//         }

//         // Nombre nuevo para evitar colisiones
//         $dir = 'uploads/';
//         if (!file_exists($dir))
//             mkdir($dir, 0755, true);

//         $orig = pathinfo($_FILES['photo']['name'], PATHINFO_FILENAME);
//         $clean = preg_replace('/[^a-zA-Z0-9_-]/', '_', $orig);
//         $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
//         $base = "edit_user{$userId}_photo{$photoId}_{$clean}";
//         $file = "{$base}.{$ext}";
//         $path = $dir . $file;
//         $i = 1;
//         while (file_exists($path)) {
//             $file = "{$base}_{$i}.{$ext}";
//             $path = $dir . $file;
//             $i++;
//         }

//         $tmpPath = $_FILES['photo']['tmp_name'];
//         if (!resizeAndSaveImage($tmpPath, $path, $mime)) {
//             responseError('Error al guardar la imagen', 500);
//         }

//         $newUrl = "https://expresscapturevz.wuaze.com/{$path}";
//     }

//     // Actualizar en BD
//     try {
//         $stmt = $conn->prepare("UPDATE rally_fotos SET title=?, photo_url=? WHERE id=?");
//         $stmt->execute([$title, $newUrl, $photoId]);
//         responseJson(['success' => true, 'message' => 'Foto actualizada', 'url' => $newUrl]);
//     } catch (PDOException $e) {
//         responseError('Error BD: ' . $e->getMessage(), 500);
//     }
// }

function handleEdit($conn) {
    if (!isset($_POST['userId'], $_POST['photo_id'], $_POST['title'])) {
        responseError('Faltan parámetros');
    }

    $userId = intval($_POST['userId']);
    $photoId = intval($_POST['photo_id']);
    $title = $_POST['title'];

    // Verificar que la foto existe y pertenece al usuario
    $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE id=? AND userId=?");
    $stmt->execute([$photoId, $userId]);
    $foto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$foto) {
        responseError('Sin permisos', 403);
    }

    // Si la foto está aprobada, solo permitir editar el título
    if ($foto['status'] === 'aprobada') {
        if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
            responseError('No se puede modificar la imagen porque la foto ya fue aprobada');
        }

        try {
            $stmt = $conn->prepare("UPDATE rally_fotos SET title=? WHERE id=?");
            $stmt->execute([$title, $photoId]);
            responseJson([
                'success' => true,
                'message' => 'Título actualizado (foto aprobada, imagen no modificada)',
                'photo_url' => $foto['photo_url'] // devolver la misma URL
            ]);
        } catch (PDOException $e) {
            responseError('Error al actualizar título: ' . $e->getMessage(), 500);
        }
        return;
    }

    $newUrl = $foto['photo_url']; // en caso de que no haya nueva imagen

    // Si hay una nueva imagen
    if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        if ($_FILES['photo']['size'] > 10 * 1024 * 1024) {
            responseError('El archivo es demasiado grande');
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES['photo']['tmp_name']);
        $allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($mime, $allowed)) {
            responseError('Tipo de archivo no permitido');
        }

        // Guardar con nombre único
        $dir = 'uploads/';
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
        $rallyId = $foto['rallyId'];

        // Normalizar el nuevo título para que sea usable como nombre de archivo
        $normalizedTitle = preg_replace('/[^A-Za-z0-9_\-]/', '_', pathinfo($title, PATHINFO_FILENAME));

        // Construir el nuevo nombre de archivo
        $filename = "user{$userId}_rally{$rallyId}_{$normalizedTitle}." . $ext;
        $path = $dir . $filename;


        if (!resizeAndSaveImage($_FILES['photo']['tmp_name'], $path, $mime)) {
            responseError('Error al guardar la imagen', 500);
        }

        $newUrl = $path;

        // Eliminar imagen anterior
        $oldUrl = $foto['photo_url'];
        $pos = strpos($oldUrl, 'uploads/');
        if ($pos !== false) {
            $oldPath = substr($oldUrl, $pos);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }
    }

    try {
        $newStatus = $foto['status'] === 'rechazada' ? 'pendiente' : $foto['status'];
        $stmt = $conn->prepare("UPDATE rally_fotos SET title=?, photo_url=?, status=? WHERE id=?");
        $stmt->execute([$title, $newUrl, $newStatus, $photoId]);
        responseJson([
            'success' => true,
            'message' => 'Foto actualizada correctamente',
            'photo_url' => $newUrl
        ]);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}





// Eliminación de foto
// function handleDelete($conn)
// {
//     if (!isset($_POST['userId'], $_POST['photo_id']))
//         responseError('Faltan parámetros');
//     $u = intval($_POST['userId']);
//     $p = intval($_POST['photo_id']);
//     $stmt = $conn->prepare("SELECT 1 FROM rally_fotos WHERE id=? AND userId=?");
//     $stmt->execute([$p, $u]);
//     if (!$stmt->fetch())
//         responseError('Sin permisos', 403);
//     try {
//         $conn->prepare("DELETE FROM rally_fotos WHERE id=?")->execute([$p]);
//         responseJson(['success' => true, 'message' => 'Foto eliminada']);
//     } catch (PDOException $e) {
//         responseError('Error BD: ' . $e->getMessage(), 500);
//     }
// }


function handleDelete($conn) {
    if (!isset($_POST['photo_id'], $_POST['userId'])) {
        responseError('Faltan parámetros');
    }

    $photoId = intval($_POST['photo_id']);
    $userId = intval($_POST['userId']);

    // Verificar que la foto pertenece al usuario
    $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE id=? AND userId=?");
    $stmt->execute([$photoId, $userId]);
    $foto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$foto) {
        responseError('Foto no encontrada o sin permisos', 403);
    }

    // Si la foto está aprobada, no se permite eliminar
    if ($foto['status'] === 'aprobada') {
        responseError('No puedes eliminar una foto que ya ha sido aprobada por el administrador.');
    }

    // Eliminar archivo del servidor si existe (funciona en local y en producción)
    $url = $foto['photo_url'];
    $pos = strpos($url, 'uploads/');
    if ($pos !== false) {
        $filePath = substr($url, $pos); // ej: uploads/foto.jpg
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    // Eliminar de la base de datos
    try {
        $stmt = $conn->prepare("DELETE FROM rally_fotos WHERE id=? AND userId=?");
        $stmt->execute([$photoId, $userId]);
        responseJson(['success' => true, 'message' => 'Foto eliminada correctamente']);
    } catch (PDOException $e) {
        responseError('Error al eliminar la foto: ' . $e->getMessage(), 500);
    }
}


// Obtener fotos de un usuario en rallyes actuales
function handleGetFotosUsuarioActuales($conn)
{
    $userId = intval($_GET['userId']);

    try {
        $stmt = $conn->prepare("
            SELECT rf.*
            FROM rally_fotos rf
            INNER JOIN rallies r ON rf.rallyId = r.id
            WHERE rf.userId = ? AND r.end_date >= CURDATE()
        ");
        $stmt->execute([$userId]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        responseJson(['photos' => $photos]);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}


// Obtener fotos de un usuario en un rally
function handleGetUserPhotos($conn)
{
    $u = intval($_GET['userId']);
    $r = intval($_GET['rallyId']);
    try {
        $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE userId=? AND rallyId=?");
        $stmt->execute([$u, $r]);
        responseJson(['photos' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}

// Obtener fotos de un rally
function handleGetRallyPhotos($conn)
{
    $r = intval($_GET['rallyId']);
    try {
        $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE rallyId=? AND status='aprobada'");
        $stmt->execute([$r]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($photos) {
            responseJson(['photos' => $photos]);
        } else {
            responseJson(['success' => false, 'message' => 'No hay fotos'], 200);
        }
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }
}
// Obtener fotos de un usuario
function handleGetFotosPorUsuario($conn)
{
    $userId = intval($_GET['userId']);

    try {
        $stmt = $conn->prepare("SELECT * FROM rally_fotos WHERE userId = ?");
        $stmt->execute([$userId]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        responseJson(['photos' => $photos]);
    } catch (PDOException $e) {
        responseError('Error BD: ' . $e->getMessage(), 500);
    }


}
ob_clean();
?>