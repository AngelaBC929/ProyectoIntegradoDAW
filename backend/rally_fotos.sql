CREATE TABLE rally_fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID único de la foto
    rallyId INT NOT NULL,                     -- ID del rally al que pertenece la foto
    userId INT NOT NULL,                      -- ID del usuario que sube la foto
    photo_url VARCHAR(512) NOT NULL,           -- URL del archivo de la foto (amplié el tamaño a 512 por seguridad)
    title VARCHAR(255),                        -- Título de la foto (opcional, se puede modificar)
    status ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',  -- Estado de la foto
    votos INT DEFAULT 0,                       -- Número de votos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de subida
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Fecha de actualización
    FOREIGN KEY (rallyId) REFERENCES rallies(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX (rallyId),                         -- Índice explícito para mejorar el rendimiento de consultas por rallyId
    INDEX (userId)                           -- Índice explícito para mejorar el rendimiento de consultas por userId
);
