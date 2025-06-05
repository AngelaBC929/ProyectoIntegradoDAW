-- Crear base de datos
CREATE DATABASE IF NOT EXISTS rally_fotografico;
USE rally_fotografico;

-- Crear tabla de usuarios con nombres actualizados
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastName VARCHAR(150) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  birthdate DATE NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('participante', 'admin') DEFAULT 'participante',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar 6 usuarios (5 normales, 1 admin)
INSERT INTO usuarios (name, lastName, email, birthdate, username, password, role) VALUES
('Jose', 'Martínez López', 'jose.martinez@example.com', '1990-05-15', 'jose', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'participante'),
('Marco', 'García Torres', 'marco.garcia@example.com', '1985-03-22', 'marco', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'participante'),
('Ana', 'Rodríguez Pérez', 'ana.rodriguez@example.com', '1992-07-10', 'ana', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'participante'),
('David', 'Sánchez Ruiz', 'david.sanchez@example.com', '1988-12-01', 'david', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'participante'),
('Admin', 'Principal', 'admin@example.com', '1980-01-01', 'admin', '$2y$10$eF9GydpA4zE/0Uo3n3yRmev4vUG7ApVGDiW2wA0gCjzKYU4dLZaq2', 'admin');
('Angela', 'Borges Cantarino', 'angela.borges@example.com', '1983-08-12', 'angela', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'participante'),
