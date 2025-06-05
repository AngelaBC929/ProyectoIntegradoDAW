-- Crear tabla de inscripciones
CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rallyId INT NOT NULL,
  userId INT NOT NULL,
  fechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rallyId) REFERENCES rallies(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE
);
