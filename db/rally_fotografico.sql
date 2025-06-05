-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-06-2025 a las 18:36:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rally_fotografico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inscripciones`
--

CREATE TABLE `inscripciones` (
  `id` int(11) NOT NULL,
  `rallyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `fechaInscripcion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inscripciones`
--

INSERT INTO `inscripciones` (`id`, `rallyId`, `userId`, `fechaInscripcion`) VALUES
(108, 2, 1, '2025-06-03 14:22:39'),
(109, 2, 3, '2025-06-03 14:25:30'),
(110, 2, 37, '2025-06-05 08:00:52'),
(111, 2, 2, '2025-06-05 08:20:22'),
(112, 1, 37, '2025-06-05 13:24:16'),
(113, 1, 3, '2025-06-05 13:26:21'),
(114, 1, 1, '2025-06-05 13:27:49'),
(115, 1, 4, '2025-06-05 15:44:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rallies`
--

CREATE TABLE `rallies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `theme` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rallies`
--

INSERT INTO `rallies` (`id`, `title`, `description`, `start_date`, `end_date`, `location`, `theme`, `created_by`, `created_at`) VALUES
(1, 'Rally Primavera 2025', 'Un rally fotográfico que celebra la llegada de la primavera. Captura la naturaleza, flores y colores vivos.', '2025-06-03', '2025-06-20', 'Parque Central', 'Naturaleza', 14, '2025-04-25 00:44:41'),
(2, 'Rally Urbano Nocturno', 'Fotografía la ciudad bajo las luces de la noche. Busca reflejos, luces y contrastes urbanos.', '2025-06-02', '2025-06-04', 'Centro Histórico', 'Paisaje urbano', 14, '2025-04-25 00:44:41'),
(3, 'Rally de Naturaleza', 'Explora la belleza de la naturaleza en su máxima expresión. Captura paisajes, fauna y flora.', '2025-05-15', '2025-05-30', 'Reserva Natural', 'Naturaleza', 14, '2025-04-25 00:44:41'),
(7, 'Rally Costero', 'Explora la belleza de la costa, desde playas tranquilas hasta acantilados dramáticos.', '2025-07-05', '2025-07-11', 'Costa del Sol', 'Mar y playa', 14, '2025-04-25 00:44:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rally_fotos`
--

CREATE TABLE `rally_fotos` (
  `id` int(11) NOT NULL,
  `rallyId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `photo_url` varchar(512) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` enum('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
  `votos` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rally_fotos`
--

INSERT INTO `rally_fotos` (`id`, `rallyId`, `userId`, `photo_url`, `title`, `status`, `votos`, `created_at`, `updated_at`) VALUES
(145, 2, 3, 'uploads/user3_rally2_parque.jpg', 'parque.jpg', 'rechazada', 0, '2025-06-03 14:27:26', '2025-06-03 14:28:50'),
(146, 2, 3, 'uploads/user3_rally2_luces.jpg', 'luces.jpg', 'aprobada', 3, '2025-06-03 14:27:37', '2025-06-05 12:27:32'),
(147, 2, 1, 'uploads/user1_rally2_trafico.jpg', 'trafico.jpg', 'aprobada', 3, '2025-06-03 14:28:10', '2025-06-05 12:27:29'),
(148, 2, 1, 'uploads/user1_rally2_th.jpg', 'th.jpg', 'aprobada', 2, '2025-06-03 14:28:20', '2025-06-05 12:22:05'),
(149, 2, 37, 'uploads/user37_rally2_luces.jpg', 'lucesMod.jpg', 'aprobada', 1, '2025-06-05 08:12:11', '2025-06-05 12:27:12'),
(153, 2, 37, 'uploads/user37_rally2_urbano_1.jpg', 'urbano.jpg', 'rechazada', 0, '2025-06-05 12:20:09', '2025-06-05 12:28:57'),
(154, 2, 2, 'uploads/user2_rally2_ciudad.jpg', 'ciudad.jpg', 'aprobada', 1, '2025-06-05 12:28:29', '2025-06-05 12:29:13'),
(155, 1, 37, 'uploads/user37_rally1_flores.jpeg', 'flores.jpeg', 'aprobada', 2, '2025-06-05 13:25:35', '2025-06-05 13:29:01'),
(156, 1, 37, 'uploads/user37_rally1_perro.jpeg', 'perro.jpeg', 'rechazada', 0, '2025-06-05 13:25:44', '2025-06-05 13:26:06'),
(157, 1, 3, 'uploads/user3_rally1_tulipanes.jpeg', 'tulipanes.jpeg', 'aprobada', 1, '2025-06-05 13:26:29', '2025-06-05 15:46:22'),
(158, 1, 1, 'uploads/user1_rally1_primavera.jpeg', 'primavera.jpeg', 'aprobada', 0, '2025-06-05 13:28:06', '2025-06-05 13:28:25'),
(159, 1, 1, 'uploads/user1_rally1_perro.jpeg', 'perro.jpeg', 'pendiente', 0, '2025-06-05 13:29:15', '2025-06-05 13:29:15'),
(160, 2, 2, 'uploads/user2_rally2_luces.jpg', 'luces.jpg', 'aprobada', 0, '2025-06-05 14:28:46', '2025-06-05 14:30:05'),
(161, 2, 2, 'uploads/user2_rally2_urbano_1.jpg', 'urbano.jpg', 'aprobada', 0, '2025-06-05 14:28:54', '2025-06-05 14:29:18'),
(162, 2, 3, 'uploads/user3_rally2_foto1.jpg', 'foto1.jpg', 'pendiente', 0, '2025-06-05 14:38:07', '2025-06-05 14:38:07'),
(163, 1, 3, 'uploads/user3_rally1_foto1.jpg', 'foto1.jpg', 'rechazada', 0, '2025-06-05 14:49:41', '2025-06-05 15:45:35'),
(164, 1, 3, 'uploads/user3_rally1_luces.jpg', 'luces.jpg', 'rechazada', 0, '2025-06-05 14:50:25', '2025-06-05 15:45:38'),
(165, 1, 4, 'uploads/user4_rally1_primavera.jpeg', 'primaveraMod.jpeg', 'aprobada', 1, '2025-06-05 15:44:43', '2025-06-05 15:46:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lastName` varchar(150) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `birthdate` date NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `name`, `lastName`, `email`, `birthdate`, `username`, `password`, `role`, `createdAt`) VALUES
(1, 'Jose', 'Martínez López', 'jose.martinez@example.com', '1990-05-15', 'jose', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'user', '2025-04-25 00:26:15'),
(2, 'Marco', 'García Torres', 'marco.garcia@example.com', '1985-03-22', 'marco', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'user', '2025-04-25 00:26:15'),
(3, 'Ana', 'Rodríguez Pérez', 'ana.rodriguez@example.com', '1992-07-10', 'ana', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'user', '2025-04-25 00:26:15'),
(4, 'David', 'Sánchez Ruiz', 'david.sanchez@example.com', '1988-12-01', 'david', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'user', '2025-04-25 00:26:15'),
(14, 'Admin', 'Principal', 'admin@example.com', '1990-01-01', 'admin', '$2y$10$m6BVWbxN8SOlzge3KGFr9uuia6fnjhY0im4nBlDSc1FhN8klZ5CiK', 'admin', '2025-05-01 16:38:00'),
(37, 'Angela', 'Borges Cantarino', 'angela@example.com', '1983-08-12', 'angela', '$2y$10$e.vZaIB6jVEixU42lbZ7ae/eLRNNfr6KORjRX.rwyZJhCPDDr0v.O', 'user', '2025-05-30 00:05:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votos`
--

CREATE TABLE `votos` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  `voto` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votos`
--

INSERT INTO `votos` (`id`, `userId`, `photo_id`, `voto`, `created_at`) VALUES
(37, 37, 146, 1, '2025-06-03 14:30:08'),
(38, 37, 148, 1, '2025-06-03 14:30:10'),
(41, 2, 147, 1, '2025-06-03 14:31:01'),
(42, 37, 147, 1, '2025-06-04 11:36:44'),
(43, 2, 146, 1, '2025-06-04 11:37:14'),
(44, 2, 148, 1, '2025-06-05 12:22:05'),
(45, 2, 149, 1, '2025-06-05 12:27:12'),
(46, 1, 147, 1, '2025-06-05 12:27:29'),
(47, 1, 146, 1, '2025-06-05 12:27:32'),
(48, 2, 154, 1, '2025-06-05 12:29:12'),
(49, 2, 155, 1, '2025-06-05 13:27:36'),
(50, 1, 155, 1, '2025-06-05 13:29:01'),
(51, 4, 157, 1, '2025-06-05 15:46:22'),
(52, 4, 165, 1, '2025-06-05 15:46:25');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rallyId` (`rallyId`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `rallies`
--
ALTER TABLE `rallies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indices de la tabla `rally_fotos`
--
ALTER TABLE `rally_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rallyId` (`rallyId`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `votos`
--
ALTER TABLE `votos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`,`photo_id`),
  ADD KEY `photo_id` (`photo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT de la tabla `rallies`
--
ALTER TABLE `rallies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `rally_fotos`
--
ALTER TABLE `rally_fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `votos`
--
ALTER TABLE `votos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `inscripciones`
--
ALTER TABLE `inscripciones`
  ADD CONSTRAINT `inscripciones_ibfk_1` FOREIGN KEY (`rallyId`) REFERENCES `rallies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscripciones_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `rallies`
--
ALTER TABLE `rallies`
  ADD CONSTRAINT `rallies_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `rally_fotos`
--
ALTER TABLE `rally_fotos`
  ADD CONSTRAINT `rally_fotos_ibfk_1` FOREIGN KEY (`rallyId`) REFERENCES `rallies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rally_fotos_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `votos`
--
ALTER TABLE `votos`
  ADD CONSTRAINT `votos_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `rally_fotos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
