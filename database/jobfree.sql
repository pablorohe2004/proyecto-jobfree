-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-03-2026 a las 11:28:09
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
-- Base de datos: `jobfree`
--
CREATE DATABASE IF NOT EXISTS `jobfree` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `jobfree`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_servicio`
--

DROP TABLE IF EXISTS `categoria_servicio`;
CREATE TABLE `categoria_servicio` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `imagen` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_servicio`
--

INSERT INTO `categoria_servicio` (`id`, `descripcion`, `nombre`, `imagen`) VALUES
(1, 'Instalaciones y fallos eléctricos', 'Electricidad', 'reparaciones/electricidad.png'),
(2, 'Averías, fugas y urgencias', 'Fontanería', 'reparaciones/fontaneria.jpg'),
(3, 'Revisión y reparación de sistemas', 'Calefacción', 'reparaciones/calefaccion.jpg'),
(4, 'Reparación de lavadoras y neveras', 'Electrodomésticos', 'reparaciones/electrodomesticos.jpg'),
(5, 'Instalación y mantenimiento', 'Aire acondicionado', 'reparaciones/aire-acondicionado.jpg'),
(6, 'Apertura y cambio de cerraduras', 'Cerrajería', 'reparaciones/cerrajeria.jpg'),
(7, 'Arreglos y sustituciones', 'Reparación de persianas', 'reparaciones/reparacion-persianas.jpg'),
(8, 'Reparaciones básicas y pequeñas obras', 'Albañilería', 'reparaciones/albanileria.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

DROP TABLE IF EXISTS `mensaje`;
CREATE TABLE `mensaje` (
  `id` bigint(20) NOT NULL,
  `contenido` varchar(1000) NOT NULL,
  `fecha_envio` datetime(6) NOT NULL,
  `leido` bit(1) NOT NULL,
  `destinatario_id` bigint(20) NOT NULL,
  `remitente_id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`id`, `contenido`, `fecha_envio`, `leido`, `destinatario_id`, `remitente_id`, `reserva_id`) VALUES
(1, 'Hola, estare en casa a las 18:00.', '2026-03-03 22:56:47.000000', b'0', 1, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
CREATE TABLE `notificacion` (
  `id` bigint(20) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `leida` bit(1) NOT NULL,
  `mensaje` varchar(300) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificacion`
--

INSERT INTO `notificacion` (`id`, `fecha_creacion`, `leida`, `mensaje`, `usuario_id`) VALUES
(1, '2026-03-03 23:42:16.000000', b'0', 'Tu reserva ha sido confirmada', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id` bigint(20) NOT NULL,
  `estado` enum('PAGADO','PENDIENTE','REEMBOLSADO') NOT NULL,
  `fecha_pago` datetime(6) NOT NULL,
  `importe` double NOT NULL,
  `metodo` enum('EFECTIVO','TARJETA','TRANSFERENCIA') NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `estado`, `fecha_pago`, `importe`, `metodo`, `reserva_id`) VALUES
(1, 'PENDIENTE', '2026-03-05 11:00:00.000000', 25, 'TARJETA', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_info`
--

DROP TABLE IF EXISTS `profesional_info`;
CREATE TABLE `profesional_info` (
  `id` bigint(20) NOT NULL,
  `cif` varchar(20) DEFAULT NULL,
  `descripcion` varchar(500) NOT NULL,
  `experiencia` int(11) NOT NULL,
  `nombre_empresa` varchar(100) DEFAULT NULL,
  `plan` enum('BASICO','PREMIUM','PRO') NOT NULL,
  `valoracion_media` double DEFAULT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `numero_valoraciones` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_info`
--

INSERT INTO `profesional_info` (`id`, `cif`, `descripcion`, `experiencia`, `nombre_empresa`, `plan`, `valoracion_media`, `usuario_id`, `numero_valoraciones`) VALUES
(1, 'B12345678', 'Electricista con 10 años de experiencia', 10, 'Servicios Marcos', 'PRO', 0, 1, NULL),
(2, 'B23456789', 'Especialista en fontanería doméstica', 8, 'Fontaneros Ruiz', 'BASICO', 0, 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

DROP TABLE IF EXISTS `reserva`;
CREATE TABLE `reserva` (
  `id` bigint(20) NOT NULL,
  `estado` enum('CANCELADA','COMPLETADA','CONFIRMADA','PENDIENTE') NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `precio_total` double NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id`, `estado`, `fecha_inicio`, `precio_total`, `cliente_id`, `servicio_id`) VALUES
(1, 'PENDIENTE', '2026-03-10 17:00:00.000000', 25, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio_ofrecido`
--

DROP TABLE IF EXISTS `servicio_ofrecido`;
CREATE TABLE `servicio_ofrecido` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `duracion_min` int(11) NOT NULL,
  `precio_hora` double NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `activa` bit(1) NOT NULL,
  `categoria_id` bigint(20) NOT NULL,
  `profesional_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio_ofrecido`
--

INSERT INTO `servicio_ofrecido` (`id`, `descripcion`, `duracion_min`, `precio_hora`, `titulo`, `activa`, `categoria_id`, `profesional_id`) VALUES
(1, 'Instalacion profesional de enchufes y puntos de luz', 60, 25, 'Instalacion de enchufes', b'1', 1, 1),
(2, 'Averías, fugas y urgencias en tuberías', 60, 22, 'Reparación de fugas', b'1', 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','CLIENTE','PROFESIONAL') NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `direccion`, `email`, `nombre`, `password`, `rol`, `telefono`, `ciudad`) VALUES
(1, 'Avenida del Genil 24, 41400 Écija, Sevilla', 'marcosmv71@gmail.com', 'Marcos Martín', '1234', 'PROFESIONAL', '617719027', 'Écija'),
(2, 'Calle Emilio Castelar 14, 41400 Écija, Sevilla', 'aitorvalenguti1978@gmail.com', 'Aitor Valenzuela', '1234', 'CLIENTE', '623367465', 'Écija'),
(3, 'Calle Larios 15', 'anavazquez132@gmail.com', 'Ana María Vázquez', '1234', 'PROFESIONAL', '614834587', 'Málaga');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion`
--

DROP TABLE IF EXISTS `valoracion`;
CREATE TABLE `valoracion` (
  `id` bigint(20) NOT NULL,
  `comentario` varchar(1000) DEFAULT NULL,
  `estrellas` int(11) NOT NULL,
  `fecha` datetime(6) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `valoracion`
--

INSERT INTO `valoracion` (`id`, `comentario`, `estrellas`, `fecha`, `cliente_id`, `profesional_id`, `reserva_id`) VALUES
(1, 'Muy buen profesional, puntual y eficiente.', 5, '2026-03-10 19:00:00.000000', 2, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria_servicio`
--
ALTER TABLE `categoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKdh5my7t19ko9kqrgy6wr1acbd` (`nombre`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKfi1dp7psgd7wi7n4x7aberitn` (`destinatario_id`),
  ADD KEY `FKdvdwp5crky4couuh3eocowubd` (`remitente_id`),
  ADD KEY `FKpqi31wkvsv83ujtpdel16q2ix` (`reserva_id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5hnclv9lmmc1w4335x04warbm` (`usuario_id`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKqj02ydo10plxmxqghwned0ng2` (`reserva_id`);

--
-- Indices de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKirqu016ab7f4fbtfeyki7r2bq` (`usuario_id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK82e7s21vcbieo07pamsoyi883` (`cliente_id`),
  ADD KEY `FKb3i33pbfl03tn99pdd0x3tngr` (`servicio_id`);

--
-- Indices de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKiv01o4986jk46wq7sbbh27wtq` (`categoria_id`),
  ADD KEY `FKonu2su0b1y4qwq0y4sxq17n9w` (`profesional_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`);

--
-- Indices de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK2i16ciqf8y9qhmh75k0d3t4ai` (`reserva_id`),
  ADD KEY `FKrof74syk8s7qjh9bcwidgaxrd` (`cliente_id`),
  ADD KEY `FKroyv0lu79p3c9ufpbc4j9kvoc` (`profesional_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria_servicio`
--
ALTER TABLE `categoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `FKdvdwp5crky4couuh3eocowubd` FOREIGN KEY (`remitente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKfi1dp7psgd7wi7n4x7aberitn` FOREIGN KEY (`destinatario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKpqi31wkvsv83ujtpdel16q2ix` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `FK5hnclv9lmmc1w4335x04warbm` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FKn8jkfq10o8ctrdwbr6nqjd8yd` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  ADD CONSTRAINT `FKm2ck32qs2rkn2n7cr4iphpus2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `FK82e7s21vcbieo07pamsoyi883` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKb3i33pbfl03tn99pdd0x3tngr` FOREIGN KEY (`servicio_id`) REFERENCES `servicio_ofrecido` (`id`);

--
-- Filtros para la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  ADD CONSTRAINT `FKiv01o4986jk46wq7sbbh27wtq` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_servicio` (`id`),
  ADD CONSTRAINT `FKonu2su0b1y4qwq0y4sxq17n9w` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`);

--
-- Filtros para la tabla `valoracion`
--
ALTER TABLE `valoracion`
  ADD CONSTRAINT `FK9w0r9rarfrt9o871xp2s2c43h` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`),
  ADD CONSTRAINT `FKrof74syk8s7qjh9bcwidgaxrd` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `FKroyv0lu79p3c9ufpbc4j9kvoc` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
