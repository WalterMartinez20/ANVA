-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-06-2025 a las 21:56:51
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
-- Base de datos: `anva`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `label` varchar(191) NOT NULL,
  `fullText` varchar(191) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `address`
--

INSERT INTO `address` (`id`, `userId`, `label`, `fullText`, `isDefault`, `createdAt`, `updatedAt`) VALUES
(2, 11, 'Oficina', 'Usulutan', 1, '2025-06-15 06:51:51.941', '2025-06-16 04:52:04.562'),
(3, 11, 'Casa', 'San Miguel', 0, '2025-06-15 06:53:38.725', '2025-06-16 04:52:04.558');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Carteras', 'carteras', 'Categoría de carteras artesanales', '2025-05-16 00:00:00.000', '2025-05-16 00:00:00.000'),
(2, 'Bolsos', 'bolsos', 'Categoría de bolsos tejidos y bordados', '2025-05-16 00:00:00.000', '2025-05-16 00:00:00.000'),
(3, 'Accesorios', 'accesorios', 'Categoría de accesorios para mujer', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000'),
(4, 'Bisuteria', 'bisuteria', 'collares, pulseras, pendientes, anillos, etc', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000'),
(5, 'Carteras de mano', 'carteras-mano', 'Carteras elegantes para llevar en la mano', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000'),
(6, 'Mochilas', 'mochilas', 'Mochilas artesanales de varios tamaños', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000'),
(7, 'Carteras tipo clutch', 'clutch', 'Carteras pequeñas sin asas', '2025-05-17 00:00:00.000', '2025-05-17 00:00:00.000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorite`
--

CREATE TABLE `favorite` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `favorite`
--

INSERT INTO `favorite` (`id`, `userId`, `productId`, `createdAt`) VALUES
(30, 1, 19, '2025-05-15 01:56:54.827'),
(31, 1, 11, '2025-05-15 01:57:00.268'),
(32, 1, 17, '2025-05-15 01:57:01.186'),
(33, 1, 12, '2025-05-21 17:14:38.863'),
(36, 10, 19, '2025-06-15 01:33:08.090'),
(37, 10, 18, '2025-06-15 01:33:09.209'),
(38, 11, 17, '2025-06-16 04:13:09.307');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `unit` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `material`
--

INSERT INTO `material` (`id`, `name`, `description`, `stock`, `unit`, `createdAt`, `updatedAt`) VALUES
(8, 'trapillo', '', 0, '', '2025-05-14 23:49:14.149', '2025-05-14 23:49:14.149'),
(9, 'hilo macramé', '', 0, '', '2025-05-14 23:50:23.917', '2025-05-14 23:50:23.917'),
(10, 'hilo nylon', '', 0, '', '2025-05-14 23:56:26.347', '2025-05-14 23:56:26.347'),
(11, 'tela típica', '', 0, '', '2025-05-15 00:01:42.290', '2025-05-15 00:01:42.290'),
(12, 'cuero sintético', '', 0, '', '2025-05-15 00:01:45.539', '2025-05-15 00:01:45.539'),
(13, 'macramé', '', 0, '', '2025-05-15 00:04:20.473', '2025-05-15 00:04:20.473');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `total` double NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `paymentMethod` varchar(191) DEFAULT NULL,
  `shippingMethod` varchar(191) DEFAULT NULL,
  `customerEmail` varchar(191) DEFAULT NULL,
  `customerName` varchar(191) DEFAULT NULL,
  `carrier` varchar(191) DEFAULT NULL,
  `estimatedDeliveryDate` datetime(3) DEFAULT NULL,
  `trackingNumber` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order`
--

INSERT INTO `order` (`id`, `userId`, `status`, `total`, `address`, `phone`, `createdAt`, `updatedAt`, `paymentMethod`, `shippingMethod`, `customerEmail`, `customerName`, `carrier`, `estimatedDeliveryDate`, `trackingNumber`) VALUES
(1, 2, 'PROCESSING', 155.49, NULL, NULL, '2025-04-22 01:03:13.721', '2025-04-22 01:03:13.721', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 2, 'PENDING', 149.99, NULL, NULL, '2025-04-22 01:03:13.739', '2025-04-22 01:03:13.739', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 9, 'PENDING', 223.48, 'Calle Falsa 123', '555-1234', '2025-04-22 01:03:13.739', '2025-04-22 01:03:13.739', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 9, 'PROCESSING', 149.99, 'Av. Siempre Viva 742', '555-5678', '2024-04-23 14:30:00.000', '2024-04-25 10:00:00.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 9, 'SHIPPED', 89.99, 'Calle Los Robles 456', '555-9012', '2024-04-21 09:15:00.000', '2024-04-25 10:00:00.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 9, 'DELIVERED', 300, 'Boulevard del Sol 89', '555-3456', '2024-04-18 12:45:00.000', '2024-04-25 10:00:00.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 9, 'CANCELLED', 59, 'Callejón sin salida 22', '555-7777', '2024-04-26 08:00:00.000', '2024-04-25 10:00:00.000', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 10, 'PENDING', 37.45, 'El Salvador', '8985 2467', '2025-05-31 02:05:53.299', '2025-05-31 02:05:53.299', 'cash', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(9, 10, 'PENDING', 50.29, 'El Salvador', '8985 2467', '2025-05-31 02:25:38.579', '2025-05-31 02:25:38.579', 'cash', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(10, 10, 'PENDING', 27, 'El Salvador', '8985 2467', '2025-05-31 02:42:20.829', '2025-05-31 02:42:20.829', 'cash', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(12, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 19:50:35.931', '2025-05-31 19:50:35.931', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(13, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 19:58:35.235', '2025-05-31 19:58:35.235', 'CASH', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(14, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 20:02:32.447', '2025-05-31 20:02:32.447', 'CASH', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(15, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 20:59:01.963', '2025-05-31 20:59:01.963', 'BANK_TRANSFER', 'standard', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(16, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:24:27.701', '2025-05-31 21:24:27.701', 'CASH', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(17, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:27:26.731', '2025-05-31 21:27:26.731', 'CASH', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(18, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:30:19.569', '2025-05-31 21:30:19.569', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(19, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:31:57.344', '2025-05-31 21:31:57.344', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(20, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:36:04.946', '2025-05-31 21:36:04.946', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(21, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:38:13.351', '2025-05-31 21:38:13.351', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(22, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:39:17.443', '2025-05-31 21:39:17.443', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(23, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:43:49.940', '2025-05-31 21:43:49.940', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(24, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:45:07.397', '2025-05-31 21:45:07.397', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(25, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:45:56.731', '2025-05-31 21:45:56.731', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(26, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:46:48.589', '2025-05-31 21:46:48.589', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', NULL, NULL, NULL),
(27, 10, 'PENDING', 47, 'El Salvador', '9598 9151', '2025-05-31 21:51:50.269', '2025-06-14 22:30:20.284', 'BANK_TRANSFER', 'store-pickup', 'walter@gmail.com', 'Walter Martinez', '', NULL, ''),
(28, 1, 'DELIVERED', 15, 'El Salvador', '9598 9151', '2025-06-11 19:08:41.545', '2025-06-14 23:26:10.189', 'CASH', 'store-pickup', 'admin@example.com', 'Admin Sistema', '', NULL, ''),
(29, 11, 'PENDING', 45, 'Usulutan', '79124503', '2025-06-16 16:00:20.991', '2025-06-16 16:00:20.991', 'CASH', 'store-pickup', 'alberto@gmail.com', 'Albertoooo Medranooo', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `quantity`, `price`) VALUES
(1, 8, 17, 1, 15),
(2, 8, 18, 1, 12),
(3, 8, 19, 1, 8),
(4, 9, 17, 1, 15),
(5, 9, 16, 1, 20),
(6, 9, 18, 1, 12),
(7, 10, 18, 1, 12),
(8, 10, 17, 1, 15),
(12, 12, 16, 1, 20),
(13, 12, 17, 1, 15),
(14, 12, 18, 1, 12),
(15, 13, 18, 1, 12),
(16, 13, 17, 1, 15),
(17, 13, 16, 1, 20),
(18, 14, 18, 1, 12),
(19, 14, 17, 1, 15),
(20, 14, 16, 1, 20),
(21, 15, 18, 1, 12),
(22, 15, 17, 1, 15),
(23, 15, 16, 1, 20),
(24, 16, 18, 1, 12),
(25, 16, 17, 1, 15),
(26, 16, 16, 1, 20),
(27, 17, 18, 1, 12),
(28, 17, 17, 1, 15),
(29, 17, 16, 1, 20),
(30, 18, 18, 1, 12),
(31, 18, 17, 1, 15),
(32, 18, 16, 1, 20),
(33, 19, 18, 1, 12),
(34, 19, 17, 1, 15),
(35, 19, 16, 1, 20),
(36, 20, 18, 1, 12),
(37, 20, 17, 1, 15),
(38, 20, 16, 1, 20),
(39, 21, 18, 1, 12),
(40, 21, 17, 1, 15),
(41, 21, 16, 1, 20),
(42, 22, 18, 1, 12),
(43, 22, 17, 1, 15),
(44, 22, 16, 1, 20),
(45, 23, 18, 1, 12),
(46, 23, 17, 1, 15),
(47, 23, 16, 1, 20),
(48, 24, 18, 1, 12),
(49, 24, 17, 1, 15),
(50, 24, 16, 1, 20),
(51, 25, 18, 1, 12),
(52, 25, 17, 1, 15),
(53, 25, 16, 1, 20),
(54, 26, 18, 1, 12),
(55, 26, 17, 1, 15),
(56, 26, 16, 1, 20),
(57, 27, 18, 1, 12),
(58, 27, 17, 1, 15),
(59, 27, 16, 1, 20),
(60, 28, 13, 1, 15),
(61, 29, 12, 1, 10),
(62, 29, 11, 1, 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderstatushistory`
--

CREATE TABLE `orderstatushistory` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL,
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orderstatushistory`
--

INSERT INTO `orderstatushistory` (`id`, `orderId`, `status`, `notes`, `createdAt`) VALUES
(1, 8, 'PENDING', 'Orden creada desde checkout', '2025-05-31 02:05:53.299'),
(2, 9, 'PENDING', 'Orden creada desde checkout', '2025-05-31 02:25:38.579'),
(3, 10, 'PENDING', 'Orden creada desde checkout', '2025-05-31 02:42:20.829'),
(4, 12, 'PENDING', 'Orden creada desde checkout', '2025-05-31 19:50:35.931'),
(5, 13, 'PENDING', 'Orden creada desde checkout', '2025-05-31 19:58:35.235'),
(6, 14, 'PENDING', 'Orden creada desde checkout', '2025-05-31 20:02:32.447'),
(7, 15, 'PENDING', 'Orden creada desde checkout', '2025-05-31 20:59:01.963'),
(8, 16, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:24:27.701'),
(9, 17, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:27:26.731'),
(10, 18, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:30:19.569'),
(11, 19, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:31:57.344'),
(12, 20, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:36:04.946'),
(13, 21, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:38:13.351'),
(14, 22, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:39:17.443'),
(15, 23, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:43:49.940'),
(16, 24, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:45:07.397'),
(17, 25, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:45:56.731'),
(18, 26, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:46:48.589'),
(19, 27, 'PENDING', 'Orden creada desde checkout', '2025-05-31 21:51:50.269'),
(20, 28, 'PENDING', 'Orden creada desde checkout', '2025-06-11 19:08:41.545'),
(21, 28, 'PROCESSING', NULL, '2025-06-14 05:13:15.365'),
(22, 28, 'SHIPPED', NULL, '2025-06-14 05:15:53.790'),
(23, 28, 'PENDING', NULL, '2025-06-14 05:16:00.250'),
(24, 28, 'CANCELLED', NULL, '2025-06-14 05:21:53.635'),
(25, 28, 'DELIVERED', NULL, '2025-06-14 05:28:04.937'),
(26, 28, 'SHIPPED', NULL, '2025-06-14 05:28:12.412'),
(27, 28, 'PROCESSING', NULL, '2025-06-14 05:28:23.771'),
(28, 28, 'PENDING', NULL, '2025-06-14 05:28:38.324'),
(29, 28, 'PENDING', NULL, '2025-06-14 05:51:29.605'),
(30, 28, 'PENDING', NULL, '2025-06-14 21:50:02.678'),
(31, 28, 'PENDING', NULL, '2025-06-14 22:00:07.176'),
(32, 28, 'PENDING', NULL, '2025-06-14 22:00:30.549'),
(33, 28, 'PENDING', NULL, '2025-06-14 22:00:45.332'),
(34, 28, 'PENDING', NULL, '2025-06-14 22:00:58.568'),
(35, 28, 'PENDING', NULL, '2025-06-14 22:01:25.096'),
(36, 28, 'PENDING', NULL, '2025-06-14 22:01:53.581'),
(37, 28, 'PENDING', NULL, '2025-06-14 22:14:39.857'),
(38, 28, 'PENDING', NULL, '2025-06-14 22:14:49.047'),
(39, 28, 'PENDING', NULL, '2025-06-14 22:14:57.401'),
(40, 28, 'PENDING', NULL, '2025-06-14 22:24:28.889'),
(41, 27, 'PENDING', NULL, '2025-06-14 22:24:40.641'),
(42, 27, 'PENDING', NULL, '2025-06-14 22:24:53.555'),
(43, 27, 'PENDING', NULL, '2025-06-14 22:25:03.108'),
(44, 27, 'PENDING', NULL, '2025-06-14 22:25:17.526'),
(45, 27, 'PENDING', NULL, '2025-06-14 22:30:20.315'),
(46, 28, 'PENDING', NULL, '2025-06-14 22:39:26.134'),
(47, 28, 'PENDING', NULL, '2025-06-14 22:39:35.338'),
(48, 28, 'PENDING', NULL, '2025-06-14 22:39:41.845'),
(49, 28, 'PENDING', NULL, '2025-06-14 22:39:49.212'),
(50, 28, 'PENDING', NULL, '2025-06-14 22:39:57.072'),
(51, 28, 'DELIVERED', NULL, '2025-06-14 22:40:07.158'),
(52, 28, 'DELIVERED', NULL, '2025-06-14 23:03:13.544'),
(53, 28, 'DELIVERED', NULL, '2025-06-14 23:03:29.638'),
(54, 28, 'DELIVERED', NULL, '2025-06-14 23:09:56.838'),
(55, 28, 'DELIVERED', NULL, '2025-06-14 23:10:17.273'),
(56, 28, 'DELIVERED', NULL, '2025-06-14 23:11:04.295'),
(57, 28, 'DELIVERED', NULL, '2025-06-14 23:21:21.968'),
(58, 28, 'DELIVERED', NULL, '2025-06-14 23:25:22.475'),
(59, 28, 'DELIVERED', NULL, '2025-06-14 23:25:43.373'),
(60, 28, 'DELIVERED', NULL, '2025-06-14 23:25:54.199'),
(61, 28, 'DELIVERED', NULL, '2025-06-14 23:25:59.566'),
(62, 28, 'DELIVERED', NULL, '2025-06-14 23:26:04.636'),
(63, 28, 'DELIVERED', NULL, '2025-06-14 23:26:10.202'),
(64, 29, 'PENDING', 'Orden creada desde checkout', '2025-06-16 16:00:20.991');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `method` enum('CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','CASH','OTHER') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED','CANCELLED','ON_HOLD') NOT NULL DEFAULT 'PENDING',
  `reference` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `payment`
--

INSERT INTO `payment` (`id`, `orderId`, `amount`, `method`, `status`, `reference`, `createdAt`, `updatedAt`) VALUES
(1, 8, 37.45, 'CASH', 'PENDING', NULL, '2025-05-31 02:05:53.299', '2025-05-31 02:05:53.299'),
(2, 9, 50.29, 'CASH', 'PENDING', NULL, '2025-05-31 02:25:38.579', '2025-05-31 02:25:38.579'),
(3, 10, 27, 'CASH', 'PENDING', NULL, '2025-05-31 02:42:20.829', '2025-05-31 02:42:20.829'),
(5, 12, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 19:50:35.931', '2025-05-31 19:50:35.931'),
(6, 13, 47, 'CASH', 'PENDING', NULL, '2025-05-31 19:58:35.235', '2025-05-31 19:58:35.235'),
(7, 14, 47, 'CASH', 'PENDING', NULL, '2025-05-31 20:02:32.447', '2025-05-31 20:02:32.447'),
(8, 15, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 20:59:01.963', '2025-05-31 20:59:01.963'),
(9, 16, 47, 'CASH', 'PENDING', NULL, '2025-05-31 21:24:27.701', '2025-05-31 21:24:27.701'),
(10, 17, 47, 'CASH', 'PENDING', NULL, '2025-05-31 21:27:26.731', '2025-05-31 21:27:26.731'),
(11, 18, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:30:19.569', '2025-05-31 21:30:19.569'),
(12, 19, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:31:57.344', '2025-05-31 21:31:57.344'),
(13, 20, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:36:04.946', '2025-05-31 21:36:04.946'),
(14, 21, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:38:13.351', '2025-05-31 21:38:13.351'),
(15, 22, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:39:17.443', '2025-05-31 21:39:17.443'),
(16, 23, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:43:49.940', '2025-05-31 21:43:49.940'),
(17, 24, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:45:07.397', '2025-05-31 21:45:07.397'),
(18, 25, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:45:56.731', '2025-05-31 21:45:56.731'),
(19, 26, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:46:48.589', '2025-05-31 21:46:48.589'),
(20, 27, 47, 'BANK_TRANSFER', 'PENDING', NULL, '2025-05-31 21:51:50.269', '2025-06-14 22:30:20.327'),
(21, 28, 15, 'CASH', 'ON_HOLD', NULL, '2025-06-11 19:08:41.545', '2025-06-14 23:26:10.208'),
(22, 29, 45, 'CASH', 'PENDING', NULL, '2025-06-16 16:00:20.991', '2025-06-16 16:00:20.991');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `price` double NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `categorySlug` varchar(191) DEFAULT NULL,
  `colors` varchar(191) DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `materialInfo` varchar(191) DEFAULT NULL,
  `strapDescription` varchar(191) DEFAULT NULL,
  `width` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `stock`, `createdAt`, `updatedAt`, `categorySlug`, `colors`, `depth`, `height`, `materialInfo`, `strapDescription`, `width`) VALUES
(11, 'Coco', 'Forro, bolsillo interior, cierre de ziper, colgante removible de 15cm.', 35, 9, '2025-05-14 23:48:49.000', '2025-06-16 16:00:21.018', 'carteras', 'negro', 3, 17, 'trapillo', '60 cm', 24),
(12, 'Alicia', 'forro, cierre metálico tipo clutch', 10, 14, '2025-05-14 23:52:09.000', '2025-06-16 16:00:21.018', 'bolsos', 'gris', 10, 18, 'hilo macramé', 'cadena metálica plateada 86cm', 26),
(13, 'Gabrielle', 'Forro estampado y bolsillo interior. Cierre: broche metálico', 15, 11, '2025-05-14 23:55:45.000', '2025-06-11 19:08:41.587', 'bolsos', 'negro', 3, 17, 'trapillo', 'cadena metálica regulable color plata', 27),
(14, 'Frida', 'Flor tejida en la parte frontal y perlas en la parte trasera, forro. Cierre: botón de perla', 40, 9, '2025-05-14 23:58:49.000', '2025-06-11 02:08:19.305', 'carteras', 'rojo_oscuro', 5, 21, 'hilo nylon', 'cadena doble dorada 43cm', 18),
(15, 'Margarita', 'Forro, flor Margarita grande blanca a ambos lados', 15, 12, '2025-05-15 00:01:14.000', '2025-05-31 20:56:30.596', 'bolsos', 'nude', 5, 21, 'hilo macramé', 'Aros de madera estilo natural', 21),
(16, 'Lozen', 'forro de fieltro con bolsillo interior. Cierre: broche de imán.', 20, 27, '2025-05-15 00:03:37.000', '2025-05-31 21:51:50.301', 'carteras', 'cafe', 7, 20, 'tela típica, cuero sintético', 'Cadena dorada, maderas de colores, 85cm', 30),
(17, 'Audrey', 'Cierre: tipo clutch de metal dorado.', 15, 27, '2025-05-15 00:07:02.000', '2025-05-31 21:51:50.301', 'carteras', 'cafe', 10, 18, 'macramé', 'Cadena dorada 90cm', 26),
(18, 'Jazmín', 'Forro y bolsillo interior, flores con hojitas tejidas a ambos lados. Cierre: broche metálico dorado.', 20, 27, '2025-05-15 00:18:10.000', '2025-06-11 02:08:04.807', 'bolsos', 'crema', 6, 24, 'trapillo', 'Cadena dorada y perlas 80cm', 24),
(19, 'Michelle', 'Forro con bolsillo interior. Cierre: broche imán.', 10, 9, '2025-05-15 00:22:04.000', '2025-06-11 02:25:50.226', 'carteras', 'rojo_oscuro', 5, 20, 'trapillo', 'Tejida a trapillo 60cm.', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productimage`
--

CREATE TABLE `productimage` (
  `id` int(11) NOT NULL,
  `url` varchar(191) NOT NULL,
  `isMain` tinyint(1) NOT NULL DEFAULT 0,
  `productId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productimage`
--

INSERT INTO `productimage` (`id`, `url`, `isMain`, `productId`, `createdAt`) VALUES
(220, '/uploads/8e57a565-d43b-424d-aff4-1c1fa4b4ea18.png', 0, 12, '2025-05-14 23:53:14.636'),
(221, '/uploads/e222c79e-409c-41bb-8f4c-1566c9485101.png', 1, 12, '2025-05-14 23:53:14.636'),
(222, '/uploads/3018a199-32e0-4af7-ada0-597631ee0ddd.png', 0, 12, '2025-05-14 23:53:14.636'),
(223, '/uploads/0f50d4e3-de12-4824-a1b0-1aed57214c9c.png', 0, 12, '2025-05-14 23:53:14.636'),
(224, '/uploads/612b6e87-4d81-4c35-b93f-06131ff3a9b2.png', 0, 12, '2025-05-14 23:53:14.636'),
(225, '/uploads/f93af94c-839a-4773-b395-8d11db443925.png', 1, 13, '2025-05-14 23:55:45.429'),
(226, '/uploads/c8346741-629c-44ba-9104-d94221380f58.png', 0, 13, '2025-05-14 23:55:45.429'),
(227, '/uploads/d84fdc2c-32c9-496e-b83c-b2d672c90444.png', 0, 13, '2025-05-14 23:55:45.429'),
(228, '/uploads/c0c981da-9427-4acb-acfd-bc14920ee315.png', 0, 13, '2025-05-14 23:55:45.429'),
(229, '/uploads/564ef6a9-4488-484b-a1c4-e7d7ec0679f5.png', 0, 13, '2025-05-14 23:55:45.429'),
(230, '/uploads/021276ce-81c3-4eec-8a03-e8cf1b9eb52d.png', 0, 13, '2025-05-14 23:55:45.429'),
(306, '/uploads/d113598c-640f-48d8-ac35-87c0bf1d3751.png', 1, 17, '2025-05-31 20:55:36.800'),
(307, '/uploads/552f399b-45f9-4af1-b09f-56ae7905f23e.png', 0, 17, '2025-05-31 20:55:36.800'),
(308, '/uploads/af342acd-ee8b-4504-b4e6-52f80d2369e3.png', 0, 17, '2025-05-31 20:55:36.800'),
(309, '/uploads/bd6037e5-14c4-4ee8-9b21-4a8b55b6763d.png', 0, 17, '2025-05-31 20:55:36.800'),
(310, '/uploads/27117f0f-5bd6-41fa-9211-b32a556940d1.png', 0, 16, '2025-05-31 20:55:59.424'),
(311, '/uploads/28b60d0e-8114-4889-9a7e-ab81404a912b.png', 1, 16, '2025-05-31 20:55:59.424'),
(312, '/uploads/df6e3f7e-5fd4-4deb-b81b-6c49aee6f422.png', 0, 16, '2025-05-31 20:55:59.424'),
(313, '/uploads/94256417-41e2-4e3c-9877-271d4653a9c4.png', 0, 15, '2025-05-31 20:56:30.608'),
(314, '/uploads/2cf945b3-f59e-4747-8b4e-43f942429ddf.png', 0, 15, '2025-05-31 20:56:30.608'),
(315, '/uploads/3e0cfe33-2067-46d0-a27c-3c6f5b0b72ad.png', 1, 15, '2025-05-31 20:56:30.608'),
(316, '/uploads/ac596d28-60db-444c-a551-2767c3dd4bdc.png', 0, 15, '2025-05-31 20:56:30.608'),
(317, '/uploads/1819239d-69e7-46aa-9c76-4cd4565fb334.png', 0, 15, '2025-05-31 20:56:30.608'),
(336, '/uploads/d7240934-2abd-403b-ae21-95e6c16f77e2.png', 1, 11, '2025-06-07 02:45:11.147'),
(337, '/uploads/45367d36-8486-466b-af5b-c81a09c4dc8b.png', 0, 11, '2025-06-07 02:45:11.147'),
(338, '/uploads/127f4b43-2d6c-4ef8-ab49-746886508d34.png', 0, 11, '2025-06-07 02:45:11.147'),
(339, '/uploads/22668e82-4f5d-489e-ac95-6cc5a23dc6cc.png', 0, 11, '2025-06-07 02:45:11.147'),
(340, '/uploads/e3d78481-272d-4474-9cf7-58cd6136338f.png', 0, 11, '2025-06-07 02:45:11.147'),
(345, '/uploads/693858a1-ca8d-4867-9d14-5cbc3b00e635.png', 0, 18, '2025-06-11 02:08:04.814'),
(346, '/uploads/131661c3-92a3-49e7-9810-0881834cac5c.png', 0, 18, '2025-06-11 02:08:04.814'),
(347, '/uploads/bfcf9c66-6ce1-4d8e-9d24-35c874d39947.png', 0, 18, '2025-06-11 02:08:04.814'),
(348, '/uploads/f384b019-34de-4a68-a1e6-f774a2200d2e.png', 1, 18, '2025-06-11 02:08:04.814'),
(349, '/uploads/091d2bad-ea1c-41a3-b3a6-25daebde56f5.png', 0, 18, '2025-06-11 02:08:04.814'),
(350, '/uploads/62be4bde-a26f-4805-99e4-5e71943c0dc4.png', 0, 18, '2025-06-11 02:08:04.814'),
(351, '/uploads/ac5486fa-5ba2-4145-98fd-c2722e61c270.png', 0, 14, '2025-06-11 02:08:19.311'),
(352, '/uploads/90c9ebfd-c2e1-498d-9bc0-9479150a6a2f.png', 0, 14, '2025-06-11 02:08:19.311'),
(353, '/uploads/fc9694da-3746-4784-bb11-7f82533878ce.png', 1, 14, '2025-06-11 02:08:19.311'),
(358, '/uploads/1f6344d5-2b49-48f2-b27c-4f32199a8802.png', 0, 19, '2025-06-11 02:25:50.234'),
(359, '/uploads/a2420bf3-c714-4d2a-bafb-df006cd05ede.png', 1, 19, '2025-06-11 02:25:50.234'),
(360, '/uploads/853c1a7c-a761-4451-9d40-6c943e62bbf5.png', 0, 19, '2025-06-11 02:25:50.234'),
(361, '/uploads/50d96798-fe5f-47dc-beb3-4cbbdc30cedd.png', 0, 19, '2025-06-11 02:25:50.234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productmaterial`
--

CREATE TABLE `productmaterial` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `materialId` int(11) NOT NULL,
  `quantity` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productmaterial`
--

INSERT INTO `productmaterial` (`id`, `productId`, `materialId`, `quantity`) VALUES
(79, 12, 9, 0),
(80, 13, 8, 0),
(97, 17, 13, 0),
(98, 16, 11, 0),
(99, 16, 12, 0),
(100, 15, 9, 0),
(104, 11, 8, 0),
(106, 18, 8, 0),
(107, 14, 10, 0),
(108, 19, 8, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nombres` varchar(191) NOT NULL,
  `apellidos` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','USER','GUEST') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `lastLogin` datetime(3) DEFAULT NULL,
  `totalOrders` int(11) NOT NULL DEFAULT 0,
  `totalSpent` double NOT NULL DEFAULT 0,
  `reviewsCount` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `nombres`, `apellidos`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `avatar`, `phone`, `address`, `lastLogin`, `totalOrders`, `totalSpent`, `reviewsCount`, `isActive`) VALUES
(1, 'Admin', 'Sistema', 'admin@example.com', '$2b$10$Sa2xVY7k.2oRpOaKLTMcCubD1uKTnK2e028f/20FAVypYXhHTkhlK', 'ADMIN', '2025-04-22 01:03:13.392', '2025-06-16 17:23:46.731', NULL, '', '', NULL, 0, 0, 0, 1),
(2, 'Usuario', 'Regular', 'user@example.com', '$2b$10$fZJyDQ1o8qCPUo2QhIv1IeNJGeugFH1VifhZgv5Y.GETwSxey9.8S', 'USER', '2025-04-22 01:03:13.408', '2025-04-22 01:03:13.408', NULL, NULL, NULL, NULL, 0, 0, 0, 1),
(9, 'kevin', 'kevin', 'kevin@gmail.com', '$2b$12$HLEXpKpdGxuZZH2HBoPOJecmBi9QvTfips.s/MoamS.OH3JzPeWRe', 'USER', '2025-04-30 14:37:34.779', '2025-04-30 14:37:34.779', NULL, NULL, NULL, NULL, 0, 0, 0, 1),
(10, 'Walter', 'Martinez', 'walter@gmail.com', '$2b$12$4OgfR5QegWxHH2ok5L1gkeF6chMwu2jy1B6tVEmmqw3LkGLDvGMR2', 'USER', '2025-05-30 23:18:58.260', '2025-06-16 18:07:21.294', NULL, '', '', NULL, 0, 0, 0, 1),
(11, 'Walter1', 'Medrano', 'alberto@gmail.com', '$2b$10$y8ubbi/UNbdXy7dwrerVuei3YxQ0Gwgv.JH9hK/dmPhu34amA.qT.', 'USER', '2025-06-15 05:25:00.618', '2025-06-16 18:12:11.483', NULL, '79124503', 'Usulutan', NULL, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('b0b4c928-b6c4-48d4-9b37-517b7b5fc52f', 'f19d32fe2dd9399ce19e0219e72966e99a76eec9b754248958dfb2b0329b6f98', '2025-05-17 03:55:16.259', '20250507233804_agregar_nuevos_campos', NULL, NULL, '2025-05-17 03:55:14.499', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Address_userId_fkey` (`userId`);

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indices de la tabla `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Favorite_userId_productId_key` (`userId`,`productId`),
  ADD KEY `Favorite_productId_fkey` (`productId`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Material_name_key` (`name`);

--
-- Indices de la tabla `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indices de la tabla `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`);

--
-- Indices de la tabla `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderStatusHistory_orderId_fkey` (`orderId`);

--
-- Indices de la tabla `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payment_orderId_fkey` (`orderId`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Product_categorySlug_fkey` (`categorySlug`);

--
-- Indices de la tabla `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductImage_productId_fkey` (`productId`);

--
-- Indices de la tabla `productmaterial`
--
ALTER TABLE `productmaterial`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductMaterial_productId_materialId_key` (`productId`,`materialId`),
  ADD KEY `ProductMaterial_materialId_fkey` (`materialId`);

--
-- Indices de la tabla `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_productId_fkey` (`productId`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `productimage`
--
ALTER TABLE `productimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=362;

--
-- AUTO_INCREMENT de la tabla `productmaterial`
--
ALTER TABLE `productmaterial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `Favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  ADD CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_categorySlug_fkey` FOREIGN KEY (`categorySlug`) REFERENCES `category` (`slug`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `productmaterial`
--
ALTER TABLE `productmaterial`
  ADD CONSTRAINT `ProductMaterial_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `material` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductMaterial_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
