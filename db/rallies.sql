-- Borrar la tabla rallies si existe
DROP TABLE IF EXISTS rallies;

-- Crear la tabla rallies
CREATE TABLE rallies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location VARCHAR(255),
  theme VARCHAR(100),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertar datos de ejemplo en la tabla rallies
INSERT INTO rallies (title, description, start_date, end_date, location, theme, created_by)
VALUES
('Rally Primavera 2025', 'Un rally fotográfico que celebra la llegada de la primavera. Captura la naturaleza, flores y colores vivos.', '2025-04-01', '2025-04-15', 'Parque Central', 'Naturaleza', 14),
('Rally Urbano Nocturno', 'Fotografía la ciudad bajo las luces de la noche. Busca reflejos, luces y contrastes urbanos.', '2025-05-05', '2025-05-20', 'Centro Histórico', 'Paisaje urbano', 14),
('Rally de Naturaleza', 'Explora la belleza de la naturaleza en su máxima expresión. Captura paisajes, fauna y flora.', '2025-05-15', '2025-05-30', 'Reserva Natural', 'Naturaleza', 14),
('Rally de Retratos', 'Captura la esencia de las personas a través del retrato. Busca emociones y expresiones únicas.', '2025-06-10', '2025-06-20', 'Estudio Fotográfico', 'Fotografia', 14),
('Rally Costero', 'Explora la belleza de la costa, desde playas tranquilas hasta acantilados dramáticos.', '2025-06-01', '2025-06-10', 'Costa del Sol', 'Mar y Playa', 14);
