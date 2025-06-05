CREATE TABLE IF NOT EXISTS votos (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- ID único para cada voto
    userId INT NOT NULL,                -- ID del usuario que votó
    photo_id INT NOT NULL,              -- ID de la foto que recibió el voto
    voto INT NOT NULL,                  -- Voto (+1 o -1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha y hora del voto
    FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (photo_id) REFERENCES rally_fotos(id) ON DELETE CASCADE,

    UNIQUE (userId, photo_id)  -- 👈 Evita votos duplicados por usuario
);
