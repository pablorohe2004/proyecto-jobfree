-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-04-2026 a las 12:52:54
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
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_servicio`
--

INSERT INTO `categoria_servicio` (`id`, `nombre`) VALUES
(5, 'Clases'),
(3, 'Cuidado personal'),
(1, 'Mantenimiento'),
(4, 'Mascotas'),
(7, 'Otros'),
(2, 'Reparaciones'),
(6, 'Urgencias');

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
(1, 'Hola, ¿podrías venir mañana por la mañana para una limpieza general?', '2026-03-01 10:05:00.000000', b'1', 2, 1, 1),
(2, 'Sí, sin problema. ¿Sobre qué hora te viene mejor?', '2026-03-01 10:10:00.000000', b'1', 1, 2, 1),
(3, 'A las 9 estaría perfecto.', '2026-03-01 10:12:00.000000', b'1', 2, 1, 1),
(4, 'Perfecto, allí estaré.', '2026-03-01 10:15:00.000000', b'1', 1, 2, 1),
(5, 'Gracias, todo quedó genial 👍', '2026-03-03 13:30:00.000000', b'1', 2, 1, 1),
(6, 'Hola, necesito una limpieza profunda del piso.', '2026-03-02 12:40:00.000000', b'1', 1, 3, 2),
(7, 'Perfecto, ¿incluye cocina y baños?', '2026-03-02 12:45:00.000000', b'1', 3, 1, 2),
(8, 'Sí, todo completo.', '2026-03-02 12:46:00.000000', b'1', 1, 3, 2),
(9, 'Genial, lo dejo todo listo.', '2026-03-05 14:30:00.000000', b'1', 3, 1, 2),
(10, 'Buenas, tengo varias cosas pequeñas que arreglar en casa.', '2026-03-04 09:20:00.000000', b'1', 1, 5, 3),
(11, 'Perfecto, soy manitas, dime qué necesitas.', '2026-03-04 09:25:00.000000', b'1', 5, 1, 3),
(12, 'Colgar cuadros y ajustar una puerta.', '2026-03-04 09:27:00.000000', b'1', 1, 5, 3),
(13, 'Hola, tengo un problema eléctrico en casa.', '2026-03-06 08:10:00.000000', b'1', 2, 9, 5),
(14, '¿Qué tipo de problema?', '2026-03-06 08:12:00.000000', b'1', 9, 2, 5),
(15, 'Salta el automático constantemente.', '2026-03-06 08:13:00.000000', b'1', 2, 9, 5),
(16, 'Vale, lo reviso cuando vaya.', '2026-03-06 08:15:00.000000', b'1', 9, 2, 5),
(17, 'Ya funciona todo perfecto, gracias.', '2026-03-08 12:30:00.000000', b'1', 2, 9, 5),
(18, 'Tengo una fuga en el baño, ¿puedes venir?', '2026-03-10 11:10:00.000000', b'1', 3, 17, 9),
(19, 'Sí, ¿es urgente?', '2026-03-10 11:12:00.000000', b'1', 17, 3, 9),
(20, 'Sí, pierde bastante agua.', '2026-03-10 11:13:00.000000', b'1', 3, 17, 9),
(21, 'Voy en camino.', '2026-03-10 11:15:00.000000', b'1', 17, 3, 9),
(22, 'Fuga solucionada 👍', '2026-03-13 18:30:00.000000', b'1', 3, 17, 9),
(23, 'Hola, mi lavadora no funciona.', '2026-03-13 15:10:00.000000', b'1', 4, 1, 12),
(24, '¿Hace algún ruido o no enciende?', '2026-03-13 15:12:00.000000', b'1', 1, 4, 12),
(25, 'No enciende directamente.', '2026-03-13 15:13:00.000000', b'1', 4, 1, 12),
(26, 'Vale, lo reviso mañana.', '2026-03-13 15:15:00.000000', b'1', 1, 4, 12),
(27, 'Busco cuidado para una persona mayor unas horas al día.', '2026-03-08 16:40:00.000000', b'1', 5, 7, 15),
(28, 'Claro, tengo experiencia en ello.', '2026-03-08 16:42:00.000000', b'1', 7, 5, 15),
(29, 'Perfecto, sería por las mañanas.', '2026-03-08 16:43:00.000000', b'1', 5, 7, 15),
(30, 'Quiero empezar a entrenar en casa.', '2026-03-19 10:10:00.000000', b'1', 6, 13, 18),
(31, 'Perfecto, te preparo un plan personalizado.', '2026-03-19 10:12:00.000000', b'1', 13, 6, 18),
(32, 'Genial, gracias!', '2026-03-19 10:13:00.000000', b'1', 6, 13, 18);

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
(1, '2026-03-01 10:16:00.000000', b'1', 'Tu reserva ha sido confirmada correctamente.', 1),
(2, '2026-03-02 12:50:00.000000', b'1', 'Tu reserva ha sido confirmada por el profesional.', 3),
(3, '2026-03-04 09:30:00.000000', b'1', 'El profesional ha aceptado tu solicitud.', 5),
(4, '2026-03-05 18:10:00.000000', b'0', 'Tu reserva está pendiente de confirmación.', 7),
(5, '2026-03-03 08:00:00.000000', b'1', 'Recuerda: tienes un servicio programado hoy a las 09:00.', 1),
(6, '2026-03-10 09:00:00.000000', b'0', 'Hoy tienes un servicio programado a las 11:00.', 5),
(7, '2026-03-15 08:00:00.000000', b'0', 'Recordatorio de servicio para hoy.', 13),
(8, '2026-03-03 12:05:00.000000', b'1', 'Pago realizado correctamente.', 1),
(9, '2026-03-05 13:10:00.000000', b'1', 'Pago confirmado en efectivo.', 3),
(10, '2026-03-12 10:05:00.000000', b'0', 'Tienes un pago pendiente de completar.', 7),
(11, '2026-03-20 10:05:00.000000', b'0', 'Pago pendiente asociado a tu reserva.', 20),
(12, '2026-03-01 10:05:30.000000', b'1', 'Nueva solicitud de reserva recibida.', 2),
(13, '2026-03-02 12:41:00.000000', b'1', 'Tienes una nueva solicitud de servicio.', 1),
(14, '2026-03-06 08:11:00.000000', b'1', 'Nuevo cliente ha solicitado tu servicio.', 2),
(15, '2026-03-10 11:11:00.000000', b'1', 'Solicitud urgente recibida.', 3),
(16, '2026-03-03 14:10:00.000000', b'1', 'Has recibido una nueva valoración ⭐⭐⭐⭐⭐', 2),
(17, '2026-03-05 15:10:00.000000', b'1', 'Un cliente ha valorado tu servicio.', 1),
(18, '2026-03-13 19:10:00.000000', b'1', 'Nueva valoración recibida.', 3),
(19, '2026-03-17 15:10:00.000000', b'1', 'Has recibido una valoración de 3 estrellas.', 4),
(20, '2026-03-01 10:05:10.000000', b'1', 'Tienes un nuevo mensaje de un cliente.', 2),
(21, '2026-03-06 08:10:30.000000', b'1', 'Nuevo mensaje recibido.', 2),
(22, '2026-03-10 11:10:30.000000', b'1', 'Tienes un mensaje sin leer.', 3),
(23, '2026-03-18 10:00:00.000000', b'0', 'Tu perfil ha sido actualizado correctamente.', 12),
(24, '2026-03-19 10:15:00.000000', b'0', 'Nuevo servicio disponible en tu zona.', 13),
(25, '2026-03-20 12:00:00.000000', b'0', 'Revisa tus reservas pendientes.', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

DROP TABLE IF EXISTS `pago`;
CREATE TABLE `pago` (
  `id` bigint(20) NOT NULL,
  `estado` enum('PAGADO','PENDIENTE','REEMBOLSADO') NOT NULL,
  `fecha_pago` datetime(6) NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `metodo` enum('EFECTIVO','TARJETA','TRANSFERENCIA') NOT NULL,
  `reserva_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `estado`, `fecha_pago`, `importe`, `metodo`, `reserva_id`) VALUES
(1, 'PAGADO', '2026-03-03 12:00:00.000000', 25.00, 'TARJETA', 1),
(2, 'PAGADO', '2026-03-05 13:00:00.000000', 40.00, 'EFECTIVO', 2),
(3, 'PAGADO', '2026-03-08 11:00:00.000000', 50.00, 'TARJETA', 5),
(4, 'PAGADO', '2026-03-13 18:00:00.000000', 45.00, 'TRANSFERENCIA', 9),
(5, 'PAGADO', '2026-03-17 13:00:00.000000', 20.00, 'EFECTIVO', 12),
(6, 'PAGADO', '2026-03-19 10:30:00.000000', 24.00, 'TARJETA', 15),
(7, 'PAGADO', '2026-03-26 10:00:00.000000', 18.00, 'EFECTIVO', 18),
(8, 'PAGADO', '2026-03-10 12:00:00.000000', 30.00, 'TARJETA', 3),
(9, 'PAGADO', '2026-03-11 13:00:00.000000', 28.00, 'EFECTIVO', 6),
(10, 'PAGADO', '2026-03-18 11:00:00.000000', 30.00, 'TRANSFERENCIA', 10),
(11, 'PAGADO', '2026-03-21 12:00:00.000000', 36.00, 'TARJETA', 13),
(12, 'PAGADO', '2026-03-23 11:00:00.000000', 60.00, 'TRANSFERENCIA', 16),
(13, 'PAGADO', '2026-03-27 13:00:00.000000', 50.00, 'TARJETA', 19),
(14, 'PENDIENTE', '2026-03-12 10:00:00.000000', 60.00, 'TARJETA', 4),
(15, 'PENDIENTE', '2026-03-20 10:00:00.000000', 55.00, 'TRANSFERENCIA', 11);

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
  `numero_valoraciones` int(11) NOT NULL,
  `plan` enum('BASICO','PREMIUM','PRO') NOT NULL,
  `valoracion_media` double NOT NULL,
  `usuario_id` bigint(20) NOT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_info`
--

INSERT INTO `profesional_info` (`id`, `cif`, `descripcion`, `experiencia`, `nombre_empresa`, `numero_valoraciones`, `plan`, `valoracion_media`, `usuario_id`, `codigo_postal`) VALUES
(1, 'B12345678', 'Especialista en mantenimiento del hogar y pequeñas reparaciones domésticas.', 8, 'Servicios Hogar García', 34, 'PREMIUM', 4.6, 2, NULL),
(2, 'B23456789', 'Electricista profesional con experiencia en instalaciones y averías domésticas.', 10, 'Electricidad Fernández', 52, 'PRO', 4.8, 4, NULL),
(3, 'B34567890', 'Fontanero especializado en fugas, desatascos y mantenimiento de tuberías.', 7, 'Fontanería Navarro', 28, 'BASICO', 4.3, 6, NULL),
(4, 'B45678901', 'Técnico en reparación de electrodomésticos y climatización.', 9, 'Reparaciones Delgado', 41, 'PREMIUM', 4.5, 8, NULL),
(5, 'B56789012', 'Cuidador profesional de personas mayores y dependientes a domicilio.', 6, 'Cuidado Senior Castro', 19, 'BASICO', 4.4, 10, NULL),
(6, 'B67890123', 'Especialista en entrenamiento personal y bienestar físico en casa.', 5, 'Fitness Serrano', 23, 'PREMIUM', 4.7, 12, NULL),
(7, 'B78901234', 'Experto en informática a domicilio: reparación, redes y optimización de equipos.', 11, 'Tech Solutions Ibáñez', 60, 'PRO', 4.9, 14, NULL),
(8, 'B89012345', 'Servicios de jardinería y mantenimiento de exteriores en viviendas.', 8, 'Jardines Peña', 31, 'BASICO', 4.2, 16, NULL),
(9, 'B90123456', 'Especialista en cuidado de mascotas y adiestramiento canino en domicilio.', 6, 'Mascotas Herrera', 27, 'PREMIUM', 4.6, 18, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

DROP TABLE IF EXISTS `reserva`;
CREATE TABLE `reserva` (
  `id` bigint(20) NOT NULL,
  `estado` enum('CANCELADA','COMPLETADA','CONFIRMADA','PENDIENTE') NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id`, `estado`, `fecha_creacion`, `fecha_inicio`, `precio_total`, `cliente_id`, `servicio_id`) VALUES
(1, 'COMPLETADA', '2026-03-01 10:00:00.000000', '2026-03-03 09:00:00.000000', 25.00, 1, 1),
(2, 'COMPLETADA', '2026-03-02 12:30:00.000000', '2026-03-05 10:00:00.000000', 40.00, 3, 2),
(3, 'CONFIRMADA', '2026-03-04 09:15:00.000000', '2026-03-10 11:00:00.000000', 30.00, 5, 5),
(4, 'PENDIENTE', '2026-03-05 18:00:00.000000', '2026-03-12 16:00:00.000000', 60.00, 7, 6),
(5, 'COMPLETADA', '2026-03-06 08:00:00.000000', '2026-03-08 09:30:00.000000', 50.00, 9, 7),
(6, 'CONFIRMADA', '2026-03-07 14:00:00.000000', '2026-03-11 12:00:00.000000', 28.00, 11, 10),
(7, 'PENDIENTE', '2026-03-08 16:30:00.000000', '2026-03-15 10:00:00.000000', 35.00, 13, 11),
(8, 'CANCELADA', '2026-03-09 20:00:00.000000', '2026-03-16 09:00:00.000000', 22.00, 15, 12),
(9, 'COMPLETADA', '2026-03-10 11:00:00.000000', '2026-03-13 17:00:00.000000', 45.00, 17, 13),
(10, 'CONFIRMADA', '2026-03-11 13:00:00.000000', '2026-03-18 10:00:00.000000', 30.00, 19, 14),
(11, 'PENDIENTE', '2026-03-12 09:00:00.000000', '2026-03-20 09:00:00.000000', 55.00, 20, 15),
(12, 'COMPLETADA', '2026-03-13 15:00:00.000000', '2026-03-17 12:00:00.000000', 20.00, 1, 16),
(13, 'CONFIRMADA', '2026-03-14 10:00:00.000000', '2026-03-21 11:00:00.000000', 36.00, 3, 18),
(14, 'PENDIENTE', '2026-03-15 18:30:00.000000', '2026-03-22 16:00:00.000000', 40.00, 5, 20),
(15, 'COMPLETADA', '2026-03-16 08:00:00.000000', '2026-03-19 09:00:00.000000', 24.00, 7, 22),
(16, 'CONFIRMADA', '2026-03-17 12:00:00.000000', '2026-03-23 10:30:00.000000', 60.00, 9, 23),
(17, 'CANCELADA', '2026-03-18 19:00:00.000000', '2026-03-25 18:00:00.000000', 32.00, 11, 24),
(18, 'COMPLETADA', '2026-03-19 10:00:00.000000', '2026-03-26 09:00:00.000000', 18.00, 13, 27),
(19, 'CONFIRMADA', '2026-03-20 14:00:00.000000', '2026-03-27 12:00:00.000000', 50.00, 15, 30),
(20, 'PENDIENTE', '2026-03-21 16:00:00.000000', '2026-03-28 11:00:00.000000', 45.00, 17, 32);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio_ofrecido`
--

DROP TABLE IF EXISTS `servicio_ofrecido`;
CREATE TABLE `servicio_ofrecido` (
  `id` bigint(20) NOT NULL,
  `activa` bit(1) NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `duracion_min` int(11) NOT NULL,
  `precio_hora` decimal(10,2) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `profesional_id` bigint(20) NOT NULL,
  `subcategoria_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio_ofrecido`
--

INSERT INTO `servicio_ofrecido` (`id`, `activa`, `descripcion`, `duracion_min`, `precio_hora`, `titulo`, `profesional_id`, `subcategoria_id`) VALUES
(1, b'1', 'Servicio completo de limpieza general en viviendas.', 120, 12.50, 'Limpieza general del hogar', 1, 1),
(2, b'1', 'Limpieza profunda incluyendo cocina y baños.', 180, 14.00, 'Limpieza profunda', 1, 2),
(3, b'1', 'Servicio de manitas para tareas básicas del hogar.', 90, 15.00, 'Manitas a domicilio', 1, 5),
(4, b'1', 'Organización y orden de espacios domésticos.', 120, 13.00, 'Organización del hogar', 1, 21),
(5, b'1', 'Reparación de averías eléctricas en domicilio.', 60, 25.00, 'Reparación eléctrica', 2, 26),
(6, b'1', 'Sustitución de enchufes y puntos eléctricos.', 45, 20.00, 'Cambio de enchufes', 2, 27),
(7, b'1', 'Revisión de cuadro eléctrico completo.', 90, 30.00, 'Revisión cuadro eléctrico', 2, 29),
(8, b'1', 'Instalación de iluminación en vivienda.', 60, 22.00, 'Instalación lámparas', 2, 7),
(9, b'1', 'Reparación de fugas de agua en tuberías.', 60, 28.00, 'Reparación de fugas', 3, 31),
(10, b'1', 'Desatascos en fregaderos y tuberías.', 45, 25.00, 'Desatascos', 3, 33),
(11, b'1', 'Reparación de grifos y sanitarios.', 50, 22.00, 'Reparación grifos', 3, 32),
(12, b'1', 'Mantenimiento general de fontanería doméstica.', 90, 30.00, 'Mantenimiento fontanería', 3, 30),
(13, b'1', 'Reparación de lavadoras a domicilio.', 60, 30.00, 'Reparación lavadora', 4, 39),
(14, b'1', 'Reparación de frigoríficos.', 70, 32.00, 'Reparación frigorífico', 4, 40),
(15, b'1', 'Reparación de hornos domésticos.', 60, 28.00, 'Reparación horno', 4, 41),
(16, b'1', 'Reparación de lavavajillas.', 65, 30.00, 'Reparación lavavajillas', 4, 42),
(17, b'1', 'Cuidado de personas mayores en domicilio.', 180, 12.00, 'Cuidado de mayores', 5, 51),
(18, b'1', 'Servicio de acompañamiento en casa.', 120, 10.00, 'Acompañamiento', 5, 53),
(19, b'1', 'Cuidado de niños por horas.', 120, 11.00, 'Cuidado de niños', 5, 55),
(20, b'1', 'Entrenamiento personal adaptado en casa.', 60, 20.00, 'Entrenador personal', 6, 68),
(21, b'1', 'Clases de yoga personalizadas.', 60, 18.00, 'Yoga en casa', 6, 69),
(22, b'1', 'Sesiones de pilates a domicilio.', 60, 18.00, 'Pilates en casa', 6, 70),
(23, b'1', 'Reparación de ordenadores en domicilio.', 60, 25.00, 'Reparación PC', 7, 147),
(24, b'1', 'Configuración de redes WiFi en casa.', 60, 22.00, 'Configuración WiFi', 7, 159),
(25, b'1', 'Optimización de equipos informáticos.', 90, 27.00, 'Optimización PC', 7, 160),
(26, b'1', 'Recuperación de datos en equipos.', 120, 35.00, 'Recuperación de datos', 7, 148),
(27, b'1', 'Mantenimiento general de jardines.', 120, 18.00, 'Mantenimiento jardín', 8, 8),
(28, b'1', 'Poda de plantas y arbustos.', 90, 17.00, 'Poda de plantas', 8, 9),
(29, b'1', 'Corte de césped en domicilio.', 60, 15.00, 'Corte de césped', 8, 10),
(30, b'1', 'Paseo de perros diario.', 60, 10.00, 'Paseo de perros', 9, 76),
(31, b'1', 'Cuidado de mascotas en casa.', 120, 12.00, 'Cuidado de mascotas', 9, 77),
(32, b'1', 'Adiestramiento canino básico.', 90, 18.00, 'Adiestramiento básico', 9, 83);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategoria_servicio`
--

DROP TABLE IF EXISTS `subcategoria_servicio`;
CREATE TABLE `subcategoria_servicio` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `imagen` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subcategoria_servicio`
--

INSERT INTO `subcategoria_servicio` (`id`, `descripcion`, `imagen`, `nombre`, `categoria_id`) VALUES
(1, 'Limpieza general de viviendas', '/images/servicios/mantenimiento/limpieza_hogar.jpg', 'Limpieza del hogar', 1),
(2, 'Limpieza intensiva de toda la casa', '/images/servicios/mantenimiento/limpieza_profunda.jpg', 'Limpieza profunda', 1),
(3, 'Limpieza tras reformas o mudanzas', '/images/servicios/mantenimiento/post_obra.jpg', 'Limpieza post obra', 1),
(4, 'Revisión y mantenimiento básico del hogar', '/images/servicios/mantenimiento/mantenimiento_general.jpg', 'Mantenimiento general del hogar', 1),
(5, 'Servicio general de manitas para tareas básicas', '/images/servicios/mantenimiento/manitas.jpg', 'Servicio de manitas', 1),
(6, 'Sustitución de bombillas y luminarias', '/images/servicios/mantenimiento/bombillas.jpg', 'Cambio de bombillas', 1),
(7, 'Montaje de lámparas y focos en vivienda', '/images/servicios/mantenimiento/lamparas.jpg', 'Instalación de lámparas', 1),
(8, 'Cuidado y mantenimiento de jardines privados', '/images/servicios/mantenimiento/jardin.jpg', 'Mantenimiento de jardín', 1),
(9, 'Poda de plantas y arbustos en domicilio', '/images/servicios/mantenimiento/poda.jpg', 'Poda de plantas', 1),
(10, 'Corte de césped en viviendas particulares', '/images/servicios/mantenimiento/cesped.jpg', 'Corte de césped', 1),
(11, 'Instalación y ajuste de sistemas de riego', '/images/servicios/mantenimiento/riego.jpg', 'Instalación de riego', 1),
(12, 'Mantenimiento básico de piscinas privadas', '/images/servicios/mantenimiento/piscina.png', 'Mantenimiento de piscina', 1),
(13, 'Limpieza de piscinas en domicilio', '/images/servicios/mantenimiento/piscina_limpieza.jpg', 'Limpieza de piscina', 1),
(14, 'Control de niveles de cloro y pH', '/images/servicios/mantenimiento/piscina_ph.png', 'Control químico piscina', 1),
(15, 'Limpieza de garajes y trasteros particulares', '/images/servicios/mantenimiento/garaje.png', 'Limpieza de garaje', 1),
(16, 'Mantenimiento de espacios exteriores de la vivienda', '/images/servicios/mantenimiento/exterior.png', 'Mantenimiento de exteriores', 1),
(17, 'Limpieza de cristales y ventanas', '/images/servicios/mantenimiento/cristales.jpg', 'Limpieza de cristales', 1),
(18, 'Limpieza de sofás y tapicería en domicilio', '/images/servicios/mantenimiento/sofa.png', 'Limpieza de sofás', 1),
(19, 'Limpieza profesional de alfombras', '/images/servicios/mantenimiento/alfombras.png', 'Limpieza de alfombras', 1),
(20, 'Servicio de planchado a domicilio', '/images/servicios/mantenimiento/planchado.jpg', 'Planchado a domicilio', 1),
(21, 'Organización de espacios y armarios', '/images/servicios/mantenimiento/organizacion.jpg', 'Organización del hogar', 1),
(22, 'Apoyo en tareas domésticas diarias', '/images/servicios/mantenimiento/asistencia.jpg', 'Asistencia doméstica', 1),
(23, 'Desinfección completa del hogar', '/images/servicios/mantenimiento/desinfeccion.png', 'Desinfección del hogar', 1),
(24, 'Tratamiento básico contra insectos en vivienda', '/images/servicios/mantenimiento/plagas.png', 'Control básico de plagas', 1),
(25, 'Limpieza de terrazas, patios y balcones', '/images/servicios/mantenimiento/terraza.png', 'Limpieza de terraza', 1),
(26, 'Reparación de instalaciones eléctricas en vivienda', '/images/servicios/reparaciones/electricidad.png', 'Reparación eléctrica', 2),
(27, 'Sustitución de enchufes dañados', '/images/servicios/reparaciones/enchufes.jpg', 'Reparación de enchufes', 2),
(28, 'Cambio de interruptores defectuosos', '/images/servicios/reparaciones/interruptores.png', 'Reparación de interruptores', 2),
(29, 'Revisión y arreglo de cuadros eléctricos', '/images/servicios/reparaciones/cuadro.png', 'Reparación de cuadro eléctrico', 2),
(30, 'Reparación de tuberías y sistemas de agua', '/images/servicios/reparaciones/fontaneria.jpg', 'Reparación de fontanería', 2),
(31, 'Detección y reparación de fugas de agua', '/images/servicios/reparaciones/fugas.png', 'Reparación de fugas', 2),
(32, 'Reparación de grifos y sanitarios', '/images/servicios/reparaciones/grifos.png', 'Reparación de grifos', 2),
(33, 'Desatascos en tuberías domésticas', '/images/servicios/reparaciones/desatascos.jpg', 'Desatascos', 2),
(34, 'Reparación de sistemas de calefacción', '/images/servicios/reparaciones/calefaccion.jpg', 'Reparación de calefacción', 2),
(35, 'Reparación de radiadores en vivienda', '/images/servicios/reparaciones/radiadores.png', 'Reparación de radiadores', 2),
(36, 'Reparación de calderas domésticas', '/images/servicios/reparaciones/caldera.png', 'Reparación de calderas', 2),
(37, 'Reparación de aire acondicionado', '/images/servicios/reparaciones/aire.png', 'Reparación de aire acondicionado', 2),
(38, 'Recarga de gas en equipos de aire', '/images/servicios/reparaciones/gas.png', 'Carga de gas aire acondicionado', 2),
(39, 'Reparación de lavadoras', '/images/servicios/reparaciones/lavadora.png', 'Reparación de lavadoras', 2),
(40, 'Reparación de frigoríficos', '/images/servicios/reparaciones/frigorifico.png', 'Reparación de frigoríficos', 2),
(41, 'Reparación de hornos', '/images/servicios/reparaciones/horno.jpg', 'Reparación de hornos', 2),
(42, 'Reparación de lavavajillas', '/images/servicios/reparaciones/lavavajillas.png', 'Reparación de lavavajillas', 2),
(43, 'Reparación de microondas', '/images/servicios/reparaciones/microondas.png', 'Reparación de microondas', 2),
(44, 'Reparación de persianas domésticas', '/images/servicios/reparaciones/persianas.png', 'Reparación de persianas', 2),
(45, 'Reparación de puertas en vivienda', '/images/servicios/reparaciones/puertas.jpg', 'Reparación de puertas', 2),
(46, 'Reparación de ventanas', '/images/servicios/reparaciones/ventanas.png', 'Reparación de ventanas', 2),
(47, 'Reparación de cerraduras', '/images/servicios/reparaciones/cerraduras.jpg', 'Reparación de cerraduras', 2),
(48, 'Reparación de muebles dañados', '/images/servicios/reparaciones/muebles.jpg', 'Reparación de muebles', 2),
(49, 'Reparación de suelos y parquet', '/images/servicios/reparaciones/suelos.png', 'Reparación de suelos', 2),
(50, 'Reparación de filtraciones y goteras', '/images/servicios/reparaciones/goteras.jpg', 'Reparación de goteras', 2),
(51, 'Atención y cuidado de personas mayores en domicilio', '/images/servicios/cuidado/mayores.jpg', 'Cuidado de mayores', 3),
(52, 'Atención a personas dependientes en casa', '/images/servicios/cuidado/dependientes.png', 'Cuidado de dependientes', 3),
(53, 'Acompañamiento diario en el hogar', '/images/servicios/cuidado/acompanamiento.jpg', 'Acompañamiento en casa', 3),
(54, 'Cuidado nocturno de personas en domicilio', '/images/servicios/cuidado/nocturno.png', 'Cuidado nocturno', 3),
(55, 'Cuidado de niños en casa', '/images/servicios/cuidado/ninos.png', 'Cuidado de niños', 3),
(56, 'Servicio de niñera por horas', '/images/servicios/cuidado/ninera.png', 'Niñera a domicilio', 3),
(57, 'Cuidado de bebés en domicilio', '/images/servicios/cuidado/bebes.png', 'Cuidado de bebés', 3),
(58, 'Apoyo escolar infantil en casa', '/images/servicios/cuidado/escolar.png', 'Apoyo escolar en casa', 3),
(59, 'Servicio de peluquería a domicilio', '/images/servicios/cuidado/peluqueria.png', 'Peluquería a domicilio', 3),
(60, 'Maquillaje profesional en casa', '/images/servicios/cuidado/maquillaje.png', 'Maquillaje a domicilio', 3),
(61, 'Manicura en domicilio', '/images/servicios/cuidado/manicura.jpg', 'Manicura a domicilio', 3),
(62, 'Pedicura en casa', '/images/servicios/cuidado/pedicura.png', 'Pedicura a domicilio', 3),
(63, 'Depilación en domicilio', '/images/servicios/cuidado/depilacion.jpg', 'Depilación a domicilio', 3),
(64, 'Tratamientos estéticos en casa', '/images/servicios/cuidado/estetica.png', 'Estética a domicilio', 3),
(65, 'Masajes relajantes en domicilio', '/images/servicios/cuidado/masajes.jpg', 'Masajes a domicilio', 3),
(66, 'Fisioterapia en casa', '/images/servicios/cuidado/fisio.jpg', 'Fisioterapia a domicilio', 3),
(67, 'Rehabilitación física en domicilio', '/images/servicios/cuidado/rehabilitacion.jpg', 'Rehabilitación en casa', 3),
(68, 'Entrenamiento personal en casa', '/images/servicios/cuidado/entrenador.jpg', 'Entrenador personal', 3),
(69, 'Clases de yoga en domicilio', '/images/servicios/cuidado/yoga.jpg', 'Yoga a domicilio', 3),
(70, 'Clases de pilates en casa', '/images/servicios/cuidado/pilates.png', 'Pilates a domicilio', 3),
(71, 'Asistencia postoperatoria en domicilio', '/images/servicios/cuidado/postoperatorio.png', 'Asistencia postoperatoria', 3),
(72, 'Ayuda en tareas personales diarias', '/images/servicios/cuidado/ayuda.jpg', 'Ayuda personal diaria', 3),
(73, 'Servicio de cuidado por horas', '/images/servicios/cuidado/horas.png', 'Cuidado por horas', 3),
(74, 'Cuidado interno en domicilio (larga estancia)', '/images/servicios/cuidado/interno.jpg', 'Cuidado interno', 3),
(75, 'Asesoramiento nutricional en casa', '/images/servicios/cuidado/nutricion.png', 'Nutricionista a domicilio', 3),
(76, 'Paseo de perros desde el domicilio del cliente', '/images/servicios/mascotas/paseo_perros.png', 'Paseo de perros', 4),
(77, 'Cuidado de perros en casa del cliente', '/images/servicios/mascotas/cuidado_perros.jpg', 'Cuidado de perros en casa', 4),
(78, 'Cuidado de gatos en el domicilio', '/images/servicios/mascotas/cuidado_gatos.png', 'Cuidado de gatos', 4),
(79, 'Cuidado de mascotas por horas', '/images/servicios/mascotas/horas.png', 'Cuidado por horas', 4),
(80, 'Cuidado nocturno de mascotas en casa', '/images/servicios/mascotas/nocturno.png', 'Cuidado nocturno de mascotas', 4),
(81, 'Cuidado de mascotas durante vacaciones', '/images/servicios/mascotas/vacaciones.jpeg', 'Cuidado en vacaciones', 4),
(82, 'Visitas a domicilio para alimentar mascotas', '/images/servicios/mascotas/visitas.jpg', 'Visitas a domicilio', 4),
(83, 'Adiestramiento canino básico en casa', '/images/servicios/mascotas/adiestramiento.jpg', 'Adiestramiento básico', 4),
(84, 'Adiestramiento avanzado y corrección de conducta', '/images/servicios/mascotas/adiestramiento_avanzado.png', 'Adiestramiento avanzado', 4),
(85, 'Socialización de perros en entorno doméstico', '/images/servicios/mascotas/socializacion.png', 'Socialización canina', 4),
(86, 'Peluquería canina a domicilio', '/images/servicios/mascotas/peluqueria.jpg', 'Peluquería canina', 4),
(87, 'Baño de mascotas en casa', '/images/servicios/mascotas/bano.png', 'Baño de mascotas', 4),
(88, 'Corte de uñas para mascotas', '/images/servicios/mascotas/unas.png', 'Corte de uñas', 4),
(89, 'Veterinario a domicilio', '/images/servicios/mascotas/veterinario.jpg', 'Veterinario a domicilio', 4),
(90, 'Administración de medicación a mascotas', '/images/servicios/mascotas/medicacion.jpg', 'Administración de medicación', 4),
(91, 'Cuidado de aves en domicilio', '/images/servicios/mascotas/aves.png', 'Cuidado de aves', 4),
(92, 'Cuidado de reptiles en casa', '/images/servicios/mascotas/reptiles.jpg', 'Cuidado de reptiles', 4),
(93, 'Cuidado de roedores y pequeños animales', '/images/servicios/mascotas/roedores.png', 'Cuidado de roedores', 4),
(94, 'Cuidado de peces y acuarios en domicilio', '/images/servicios/mascotas/peces.jpg', 'Cuidado de peces', 4),
(95, 'Mantenimiento y limpieza de acuarios', '/images/servicios/mascotas/acuario.jpg', 'Mantenimiento de acuarios', 4),
(96, 'Transporte de mascotas desde el domicilio', '/images/servicios/mascotas/transporte.png', 'Transporte de mascotas', 4),
(97, 'Acompañamiento a citas veterinarias', '/images/servicios/mascotas/acompanamiento.jpeg', 'Acompañamiento veterinario', 4),
(98, 'Alimentación programada de mascotas en casa', '/images/servicios/mascotas/comida.png', 'Alimentación programada', 4),
(99, 'Ejercicio guiado para mascotas en domicilio', '/images/servicios/mascotas/ejercicio.png', 'Ejercicio para mascotas', 4),
(100, 'Limpieza de espacios de mascotas en casa', '/images/servicios/mascotas/limpieza.png', 'Limpieza de zonas de mascotas', 4),
(101, 'Refuerzo de matemáticas nivel primaria en domicilio', '/images/servicios/clases/matematicas_primaria.png', 'Matemáticas primaria', 5),
(102, 'Apoyo en matemáticas nivel secundaria', '/images/servicios/clases/matematicas_eso.png', 'Matemáticas ESO', 5),
(103, 'Preparación de matemáticas nivel bachillerato', '/images/servicios/clases/matematicas_bachiller.png', 'Matemáticas bachillerato', 5),
(104, 'Clases de inglés conversación en casa', '/images/servicios/clases/ingles_speaking.png', 'Inglés conversación', 5),
(105, 'Refuerzo de gramática inglesa en domicilio', '/images/servicios/clases/ingles_grammar.jpg', 'Inglés gramática', 5),
(106, 'Clases de lengua y sintaxis en casa', '/images/servicios/clases/lengua.png', 'Lengua y sintaxis', 5),
(107, 'Clases de física nivel bachillerato en domicilio', '/images/servicios/clases/fisica.png', 'Física bachillerato', 5),
(108, 'Clases de química nivel bachillerato en casa', '/images/servicios/clases/quimica.png', 'Química bachillerato', 5),
(109, 'Clases de programación Java a domicilio', '/images/servicios/clases/programacion_java.png', 'Programación Java', 5),
(110, 'Clases de desarrollo web (HTML, CSS, JS)', '/images/servicios/clases/programacion_web.jpg', 'Programación web', 5),
(111, 'Clases de bases de datos SQL en casa', '/images/servicios/clases/bd_sql.png', 'Bases de datos SQL', 5),
(112, 'Clases de informática básica para principiantes', '/images/servicios/clases/informatica.jpeg', 'Informática básica', 5),
(113, 'Clases de guitarra eléctrica en domicilio', '/images/servicios/clases/guitarra_electrica.png', 'Guitarra eléctrica', 5),
(114, 'Clases de guitarra acústica en casa', '/images/servicios/clases/guitarra_acustica.png', 'Guitarra acústica', 5),
(115, 'Clases de piano para principiantes', '/images/servicios/clases/piano.png', 'Piano básico', 5),
(116, 'Clases de canto moderno en domicilio', '/images/servicios/clases/canto.png', 'Canto moderno', 5),
(117, 'Clases de dibujo artístico en casa', '/images/servicios/clases/dibujo.png', 'Dibujo artístico', 5),
(118, 'Clases de pintura acrílica a domicilio', '/images/servicios/clases/pintura.jpg', 'Pintura acrílica', 5),
(119, 'Clases de baile urbano en casa', '/images/servicios/clases/baile_urbano.jpg', 'Baile urbano', 5),
(120, 'Clases de baile latino (salsa, bachata)', '/images/servicios/clases/baile_latino.jpg', 'Baile latino', 5),
(121, 'Clases de cocina básica en domicilio', '/images/servicios/clases/cocina_basica.png', 'Cocina básica', 5),
(122, 'Clases de cocina saludable en casa', '/images/servicios/clases/cocina_saludable.png', 'Cocina saludable', 5),
(123, 'Clases de yoga en domicilio', '/images/servicios/clases/yoga.jpg', 'Yoga en casa', 5),
(124, 'Clases de pilates a domicilio', '/images/servicios/clases/pilates.png', 'Pilates en casa', 5),
(125, 'Clases de francés básico en domicilio', '/images/servicios/clases/frances.jpg', 'Francés básico', 5),
(126, 'Clases de alemán básico en casa', '/images/servicios/clases/aleman.png', 'Alemán básico', 5),
(127, 'Servicio urgente de fontanería para fugas o roturas', '/images/servicios/urgencias/fontanero.png', 'Fontanero urgente 24h', 6),
(128, 'Intervención inmediata en averías eléctricas', '/images/servicios/urgencias/electricista.jpg', 'Electricista urgente 24h', 6),
(129, 'Apertura urgente de puertas bloqueadas', '/images/servicios/urgencias/cerrajero.jpg', 'Cerrajero urgente 24h', 6),
(130, 'Desatascos urgentes en tuberías domésticas', '/images/servicios/urgencias/desatasco.jpg', 'Desatascos urgentes', 6),
(131, 'Reparación urgente de fugas de agua', '/images/servicios/urgencias/fuga.jpg', 'Fuga de agua urgente', 6),
(132, 'Restablecimiento de suministro eléctrico en casa', '/images/servicios/urgencias/electricidad.jpg', 'Corte de luz urgente', 6),
(133, 'Reparación urgente de cuadro eléctrico', '/images/servicios/urgencias/cuadro.png', 'Cuadro eléctrico urgente', 6),
(134, 'Cambio urgente de cerraduras', '/images/servicios/urgencias/cerradura.jpeg', 'Cambio de cerradura urgente', 6),
(135, 'Apertura de vivienda sin llaves', '/images/servicios/urgencias/puerta.jpg', 'Apertura de puerta urgente', 6),
(136, 'Sustitución urgente de cristales rotos', '/images/servicios/urgencias/cristal.png', 'Cristalero urgente', 6),
(137, 'Reparación urgente de electrodomésticos', '/images/servicios/urgencias/electrodomesticos.jpg', 'Electrodomésticos urgente', 6),
(138, 'Reparación urgente de aire acondicionado', '/images/servicios/urgencias/aire.png', 'Aire acondicionado urgente', 6),
(139, 'Reparación urgente de calefacción', '/images/servicios/urgencias/calefaccion.jpg', 'Calefacción urgente', 6),
(140, 'Control urgente de plagas en vivienda', '/images/servicios/urgencias/plagas.png', 'Plagas urgente', 6),
(141, 'Fumigación urgente en domicilio', '/images/servicios/urgencias/fumigacion.png', 'Fumigación urgente', 6),
(142, 'Limpieza urgente tras inundaciones o suciedad extrema', '/images/servicios/urgencias/limpieza.png', 'Limpieza urgente', 6),
(143, 'Reparación urgente de persianas bloqueadas', '/images/servicios/urgencias/persianas.png', 'Persianas urgente', 6),
(144, 'Reparación urgente de puertas dañadas', '/images/servicios/urgencias/puertas.jpg', 'Puertas urgente', 6),
(145, 'Cuidado urgente de mascotas en domicilio', '/images/servicios/urgencias/mascotas.png', 'Mascotas urgente', 6),
(146, 'Veterinario urgente a domicilio', '/images/servicios/urgencias/veterinario.jpg', 'Veterinario urgente', 6),
(147, 'Asistencia informática urgente en casa', '/images/servicios/urgencias/informatica.png', 'Informático urgente', 6),
(148, 'Recuperación urgente de datos en domicilio', '/images/servicios/urgencias/datos.png', 'Recuperación de datos urgente', 6),
(149, 'Servicio urgente de mudanza o traslado', '/images/servicios/urgencias/mudanza.jpg', 'Mudanza urgente', 6),
(150, 'Montaje urgente de muebles en casa', '/images/servicios/urgencias/muebles.png', 'Montaje urgente', 6),
(151, 'Reparación urgente de tejados o filtraciones', '/images/servicios/urgencias/tejado.jpg', 'Tejado urgente', 6),
(152, 'Organización profesional de armarios y espacios', '/images/servicios/otros/organizacion.jpg', 'Organización de espacios', 7),
(153, 'Optimización de distribución del hogar', '/images/servicios/otros/orden.png', 'Optimización del hogar', 7),
(154, 'Asesoramiento en decoración de interiores', '/images/servicios/otros/decoracion.png', 'Decoración de interiores', 7),
(155, 'Reorganización estética de viviendas', '/images/servicios/otros/interiorismo.png', 'Interiorismo básico', 7),
(156, 'Asesoría en compra de tecnología para casa', '/images/servicios/otros/tecnologia.jpg', 'Asesoría tecnológica', 7),
(157, 'Instalación básica de dispositivos inteligentes', '/images/servicios/otros/domotica.jpg', 'Domótica básica', 7),
(158, 'Configuración de asistentes virtuales en casa', '/images/servicios/otros/domotica.png', 'Configuración Alexa/Google Home', 7),
(159, 'Configuración de redes WiFi domésticas', '/images/servicios/otros/wifi.jpg', 'Configuración WiFi', 7),
(160, 'Optimización de conexión a internet en casa', '/images/servicios/otros/red.jpg', 'Optimización de red doméstica', 7),
(161, 'Digitalización de documentos en domicilio', '/images/servicios/otros/documentos.jpg', 'Digitalización de documentos', 7),
(162, 'Organización de archivos digitales', '/images/servicios/otros/digital.jpg', 'Organización digital', 7),
(163, 'Ayuda en gestiones online desde casa', '/images/servicios/otros/gestiones.jpg', 'Gestiones online', 7),
(164, 'Asistencia en trámites digitales', '/images/servicios/otros/tramites.jpg', 'Trámites digitales', 7),
(165, 'Fotografía profesional en domicilio', '/images/servicios/otros/fotografia.png', 'Fotografía a domicilio', 7),
(166, 'Grabación de vídeo personal o familiar', '/images/servicios/otros/video.jpg', 'Grabación de vídeo', 7),
(167, 'Organización de eventos en casa', '/images/servicios/otros/eventos.png', 'Organización de eventos', 7),
(168, 'Decoración de fiestas en domicilio', '/images/servicios/otros/eventos2.jpg', 'Decoración de eventos', 7),
(169, 'Asesoramiento en planificación de viajes', '/images/servicios/otros/viajes.jpg', 'Planificación de viajes', 7),
(170, 'Sesiones de coaching personal en casa', '/images/servicios/otros/coaching.jpg', 'Coaching personal', 7),
(171, 'Asesoramiento de imagen personal', '/images/servicios/otros/imagen.jpg', 'Asesoría de imagen', 7),
(172, 'Revisión y mejora de currículum en casa', '/images/servicios/otros/cv.jpg', 'Revisión de CV', 7),
(173, 'Entrenamiento mental y memoria', '/images/servicios/otros/memoria.jpg', 'Estimulación cognitiva', 7),
(174, 'Sesiones de mindfulness en domicilio', '/images/servicios/otros/mindfulness.jpg', 'Mindfulness en casa', 7),
(175, 'Planificación de rutinas familiares', '/images/servicios/otros/planificacion.jpg', 'Organización familiar', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` bigint(20) NOT NULL,
  `apellidos` varchar(150) NOT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','CLIENTE','PROFESIONAL') NOT NULL,
  `telefono` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `apellidos`, `ciudad`, `direccion`, `email`, `nombre`, `password`, `rol`, `telefono`) VALUES
(1, 'García López', 'Córdoba', 'Calle Sevilla 12', 'maria.garcia.lopez@gmail.com', 'María', '$2a$10$fizdrns/l8d11ysGeW9gxuKhzaww40/jdNAQXk9bJXZZPhKzGM2UK', 'CLIENTE', '+34612345678'),
(2, 'Fernández Ruiz', 'Sevilla', 'Avenida Andalucía 45', 'juan.fernandez88@hotmail.com', 'Juan', '$2a$10$z1lXU5n1Ww7L/IQcEZVjGeBtIrUuHd0gTqC2tQRExsLLFbi6YjNc2', 'PROFESIONAL', '+34623456789'),
(3, 'Martínez Pérez', 'Madrid', 'Calle Alcalá 102', 'lucia.martinez.p@gmail.com', 'Lucía', '$2a$10$QcZbp5dSgLJqDZZvKSGHFuUrzqJxMItwbnaMu4syn0mneN0dfvebW', 'CLIENTE', '+34634567890'),
(4, 'Sánchez Gómez', 'Málaga', 'Calle Larios 8', 'david.sanchezg@gmail.com', 'David', '$2a$10$M1HGT3EKr4ayLmn9/0TS5ewSVgdHhXCSJH2lgsoEp.82UycB8FoEm', 'PROFESIONAL', '+34645678901'),
(5, 'Romero Torres', 'Córdoba', 'Calle Palma 3', 'carmen.romero.torres@gmail.com', 'Carmen', '$2a$10$0K3yEhZVhQZ3mJdVrzFZmuLPJ7y3I956h5RL2wNS0VCFRw8fvV4wa', 'CLIENTE', '+34656789012'),
(6, 'Navarro Jiménez', 'Granada', 'Calle Recogidas 21', 'antonio.navarro.j@gmail.com', 'Antonio', '$2a$10$NG.ghUcDcpA.5iEReA8zJ.Qc2KYu4/0i4DW1KtdJ6dSGnH/KdtNju', 'PROFESIONAL', '+34667890123'),
(7, 'Moreno Castillo', 'Jaén', 'Calle Úbeda 14', 'laura.moreno.c@gmail.com', 'Laura', '$2a$10$2egsOQWwX/QfK0g6iflNs.oSSCC/2EcipR96.Dl0mj1wmSj5rUBLi', 'CLIENTE', '+34678901234'),
(8, 'Delgado Herrera', 'Cádiz', 'Avenida del Mar 9', 'sergio.delgado.h@gmail.com', 'Sergio', '$2a$10$cl0csAEWoyKlqkTBym1fXuqYm5BNtQpj9.JqoMf33vAceBmscIxt2', 'PROFESIONAL', '+34689012345'),
(9, 'Ortega Medina', 'Valencia', 'Calle Colón 56', 'ana.ortega.medina@gmail.com', 'Ana', '$2a$10$Ee9QrtrzRA8p3gudYzUEDOtcMxrFA/qEol/fAdf5CIxR6H/Vx4tRi', 'CLIENTE', '+34690123456'),
(10, 'Castro Molina', 'Barcelona', 'Calle Aragón 210', 'javier.castro.m@gmail.com', 'Javier', '$2a$10$f8r4EOBoUyuhMSiPVo6LfeScpMSuFMyfHm/2gvTPVw37icP/ESApC', 'PROFESIONAL', '+34601234567'),
(11, 'Ramos Vidal', 'Sevilla', 'Calle Triana 33', 'paula.ramos.vidal@gmail.com', 'Paula', '$2a$10$gY21F1kTCIT7XmR7urAY2eekK4qtu/jpixL5YBTu9SfeXazrNiMJG', 'CLIENTE', '+34612987654'),
(12, 'Reyes Santos', 'Córdoba', 'Calle Cruz Conde 7', 'alberto.reyes.s@gmail.com', 'Alberto', '$2a$10$V1OI.zWh6xpJwsLpNGeS0OFWr59yN7xupmYmCw5h4slJZunLZf7h2', 'PROFESIONAL', '+34623876543'),
(13, 'Molina Vega', 'Málaga', 'Calle Carretería 19', 'elena.molina.v@gmail.com', 'Elena', '$2a$10$0kvX7CtuR0X9PmlpjM55xujBqSL.rm0trZU9SFPq.i.IuntpSzJba', 'CLIENTE', '+34634765432'),
(14, 'Ibáñez Navarro', 'Madrid', 'Calle Gran Vía 88', 'daniel.ibanez.n@gmail.com', 'Daniel', '$2a$10$AbkMfAdm2Dk/eNG/L3k/duWZOSKNyCkgn0ruecT5BbAbJ3DWwj1UC', 'PROFESIONAL', '+34645654321'),
(15, 'Campos Ríos', 'Granada', 'Calle Alhambra 4', 'silvia.campos.rios@gmail.com', 'Silvia', '$2a$10$wWpqdZndKD0mooD4qcZ1HuFjc17J.bVibzKeIbH5EP2RCHewQhFQi', 'CLIENTE', '+34656543210'),
(16, 'Serrano Fuentes', 'Sevilla', 'Calle Nervión 22', 'miguel.serrano.f@gmail.com', 'Miguel', '$2a$10$Y9d8LZziNA9utgtJvThnleSz0F818.5BTtJrqdlPwpWWtuYj.w6G.', 'PROFESIONAL', '+34667432109'),
(17, 'Vargas León', 'Córdoba', 'Calle Feria 11', 'rocio.vargas.leon@gmail.com', 'Rocío', '$2a$10$lDnt9dXlZbWngYuVCaJYqeY1b8iH32c3L2CS.M8qVObOTBz0NnF3a', 'CLIENTE', '+34678321098'),
(18, 'Peña Cortés', 'Cádiz', 'Calle San Juan 6', 'fernando.pena.c@gmail.com', 'Fernando', '$2a$10$sJwUp17xo/M21/llRkVR3udJeZtotTkkcQwGVraEVzh2cvgFM9fRK', 'PROFESIONAL', '+34689210987'),
(19, 'Herrera Márquez', 'Jaén', 'Calle Linares 15', 'marta.herrera.m@gmail.com', 'Marta', '$2a$10$IdC21Mo/.7zGVfyHxCnye.Eky17c1t3SBFkhWr8SNx5pKnB7ArwNa', 'CLIENTE', '+34690198765'),
(20, 'Admin Sistema', 'Madrid', 'Calle Central 1', 'admin@jobfree.com', 'Admin', '$2a$10$eunOpqXBbRTGGwUDkjZn7O0mAMDdRC9ooXayzJwcey6itvBf3WVUe', 'ADMIN', '+34600000000'),
(21, 'Heredia López', 'Córdoba', 'Sin especificar', 'pacoro@gmail.com', 'Pablo', '$2a$10$reHmE0UbUWIyAPZ.h3uGTudpGWWX6S6owfoezHbLYsO2PzOrPsXUe', 'CLIENTE', '+34627719120'),
(22, 'Heredia Ruiz', 'Córdoba', 'Sin especificar', 'pablorh20042007redes@gmail.com', 'Pablo', '$2a$10$ePOLfWZS5cpElgJLnTCB3Ohxz4j.K3bph5t.4g7dryUwM2MFOwqQC', 'CLIENTE', '+34627719121'),
(23, 'Heredia Sánchez', 'Córdoba', 'Sin especificar', 'alberto.heredia@gmail.com', 'Alberto', '$2a$10$xFiji5I6Q7uEym9vezHcBuItLoAgSVPUeqeMKgI7xiLr5xRb2/nMi', 'CLIENTE', '+34627719122'),
(24, 'Heredia Torres', 'Palma del Río', 'Calle Ancha 31', 'pacoroca@gmail.com', 'Pablo', '$2a$10$fhhqEr0/5WHMC0lImgHiKOxChskB3LclqDIbV3r8ZnucRqw3AW2am', 'CLIENTE', '+34626638923'),
(25, 'Martínez López', 'Palma del Río', 'Calle Ancha 31', 'luis.profesional@gmail.com', 'Luis', '$2a$10$kvQLVi4T3CJauQasU1Eqtu6gmYUpWuS.iIywMuf633xdCzkIMzGA.', 'PROFESIONAL', '+3467732836433'),
(26, 'León', 'Palma del Río', 'Calle Alberca', 'pacoleon123@gmail.com', 'Paco', '$2a$10$XMIWIgSN/iJ2lpksvF7IqeJ6Zm75Lr5y2CQRgPfPhi32ItbCJ5D.q', 'PROFESIONAL', '+44612236537'),
(27, 'García Gutiérrez', 'Huelva', 'Calle Ancha', 'pruebagarcia@gmail.com', 'Luis Antonio', '$2a$10$kh04524gSXwBUpE.Q5rVNOeJjuQbbqYbSkD7fPG.e.AcBTVEaIIqC', 'CLIENTE', '+351617723485'),
(28, 'Heredia Valenzuela', 'Peñaflor', 'Calle Pera', 'yolandita@gmail.com', 'Yolanda', '$2a$10$jcmmC6XInQX94fhtKg5AxeQiGOg5.ExAb9qWyME8oZjI45rWJ5WCi', 'CLIENTE', '+34664828077'),
(29, 'Román Martín', 'Cádiz capital', 'Calle Jaén', 'gustavorm@hotmail.com', 'Gustavo', '$2a$10$Z2Re.ucGj3QtPtyj.ePkrOgDwhsIvyclDkNF2IFkgAe3FI/Jd8S1e', 'PROFESIONAL', '+33456472843'),
(30, 'Heredia Gómez', 'Córdoba', 'Calle Ancha 31', 'pablorh20042007@gmail.com', 'Pablo', '$2a$10$vQ64xHBaIsPsVetRh/BffuZUMrrrr016U.VWxngtAjAtlFLcICf4u', 'CLIENTE', '+34612234576'),
(31, 'Baena', 'Murcia', 'Calle Ácaro', 'javierbaena@gmail.com', 'Javier', '$2a$10$MqicbHql5kmuC8tuW1HVKebJg09lZxNtYNCo79qD4ZwRW/Em2P59a', 'CLIENTE', '+34616634589'),
(35, 'Guti', 'Jaén', 'Calle Perla', 'beti@gmail.com', 'Betty', '$2a$10$q2hw2Zm0dmLjaFaPpKt7LOdu8aRsOv7QtTluuOMZyY0NQJ7fDZZQ2', 'CLIENTE', '+34617723458'),
(36, 'García Márquez', 'Palma del Río', 'Calle Ancha 31', 'joanmarquez@gmail.com', 'Joan', '$2a$10$GmtKiwtMLWFMgyWCndVB.OLICoMgwDkaCXW.HRMY7x0bsz8jU5wCu', 'PROFESIONAL', '+34617719273'),
(37, 'García Márquez', 'Aljaraque', 'Calle Villaverde', 'maria.garcia.lopez1@gmail.com', 'Maria', '$2a$10$wUdDBezu4wgcTkiKjjrxMeUPQxkYyo45jZfPN4pLr2w3evTYuwFZa', 'CLIENTE', '+34727734568'),
(38, 'Heredia Martín', 'Madrid', 'Calle Huelva', 'yolandeva2020@gmail.com', 'Yolanda', '$2a$10$l8JFNs6jWEQ6bK8rPKWp0erh7ReErPhHlyUCkBaHc6hVZ/Q1F7MSK', 'PROFESIONAL', '+34623345782');

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
(1, 'Muy buen servicio, todo quedó impecable. Repetiré sin duda.', 5, '2026-03-03 14:00:00.000000', 1, 1, 1),
(2, 'Buen trabajo, aunque llegó un poco tarde. Aun así satisfecho.', 4, '2026-03-05 15:00:00.000000', 3, 1, 2),
(3, 'Servicio rápido y profesional. Solucionó el problema sin complicaciones.', 5, '2026-03-08 12:00:00.000000', 9, 2, 5),
(4, 'Muy contento con el resultado, lo recomiendo totalmente.', 5, '2026-03-13 19:00:00.000000', 17, 3, 9),
(5, 'Trabajo correcto, aunque podría mejorar en limpieza tras la reparación.', 3, '2026-03-17 15:00:00.000000', 1, 4, 12),
(6, 'Servicio rápido y eficaz, muy amable.', 4, '2026-03-19 12:00:00.000000', 7, 5, 15),
(7, 'Todo perfecto, muy profesional y puntual.', 5, '2026-03-26 12:30:00.000000', 13, 6, 18);

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
  ADD UNIQUE KEY `UKirqu016ab7f4fbtfeyki7r2bq` (`usuario_id`),
  ADD UNIQUE KEY `UK8elir2r3fk0dta4d06xp8sqag` (`cif`);

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
  ADD KEY `FKonu2su0b1y4qwq0y4sxq17n9w` (`profesional_id`),
  ADD KEY `FKkpm94273aee38r4lwfrd6yr0f` (`subcategoria_id`);

--
-- Indices de la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKcq2a4sargqm9e0kw48wv3yjv8` (`categoria_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  ADD UNIQUE KEY `UKlyn4jrsa2ou2meyuarytj8tcc` (`telefono`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `profesional_info`
--
ALTER TABLE `profesional_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `servicio_ofrecido`
--
ALTER TABLE `servicio_ofrecido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `valoracion`
--
ALTER TABLE `valoracion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  ADD CONSTRAINT `FKkpm94273aee38r4lwfrd6yr0f` FOREIGN KEY (`subcategoria_id`) REFERENCES `subcategoria_servicio` (`id`),
  ADD CONSTRAINT `FKonu2su0b1y4qwq0y4sxq17n9w` FOREIGN KEY (`profesional_id`) REFERENCES `profesional_info` (`id`);

--
-- Filtros para la tabla `subcategoria_servicio`
--
ALTER TABLE `subcategoria_servicio`
  ADD CONSTRAINT `FKcq2a4sargqm9e0kw48wv3yjv8` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_servicio` (`id`);

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
