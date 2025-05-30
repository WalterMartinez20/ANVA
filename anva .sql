-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2025 a las 02:50:49
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
(33, 1, 12, '2025-05-21 17:14:38.863');

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
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order`
--

INSERT INTO `order` (`id`, `userId`, `status`, `total`, `address`, `phone`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'PROCESSING', 155.49, NULL, NULL, NULL, '2025-04-22 01:03:13.721', '2025-04-22 01:03:13.721'),
(2, 2, 'PENDING', 149.99, NULL, NULL, NULL, '2025-04-22 01:03:13.739', '2025-04-22 01:03:13.739'),
(3, 9, 'PENDING', 223.48, 'Calle Falsa 123', '555-1234', 'Entregar por la tarde', '2025-04-22 01:03:13.739', '2025-04-22 01:03:13.739'),
(4, 9, 'PROCESSING', 149.99, 'Av. Siempre Viva 742', '555-5678', 'Llamar antes de entregar', '2024-04-23 14:30:00.000', '2024-04-25 10:00:00.000'),
(5, 9, 'SHIPPED', 89.99, 'Calle Los Robles 456', '555-9012', 'Dejar en portería', '2024-04-21 09:15:00.000', '2024-04-25 10:00:00.000'),
(6, 9, 'DELIVERED', 300, 'Boulevard del Sol 89', '555-3456', 'Pago contra entrega', '2024-04-18 12:45:00.000', '2024-04-25 10:00:00.000'),
(7, 9, 'CANCELLED', 59, 'Callejón sin salida 22', '555-7777', 'Pedido cancelado por cliente', '2024-04-26 08:00:00.000', '2024-04-25 10:00:00.000');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `method` enum('CREDIT_CARD','DEBIT_CARD','BANK_TRANSFER','CASH','OTHER') NOT NULL,
  `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `reference` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(11, 'Coco', 'Forro, bolsillo interior, cierre de ziper, colgante removible de 15cm.', 15, 10, '2025-05-14 23:48:49.000', '2025-05-14 23:49:31.000', 'carteras', 'negro', 3, 17, 'trapillo', '60 cm', 24),
(12, 'Alicia', 'forro, cierre metálico tipo clutch', 10, 15, '2025-05-14 23:52:09.000', '2025-05-14 23:53:14.000', 'bolsos', 'gris', 10, 18, 'hilo macramé', 'cadena metálica plateada 86cm', 26),
(13, 'Gabrielle', 'Forro estampado y bolsillo interior. Cierre: broche metálico', 15, 12, '2025-05-14 23:55:45.000', '2025-05-14 23:55:45.000', 'bolsos', 'negro', 3, 17, 'trapillo', 'cadena metálica regulable color plata', 27),
(14, 'Frida', 'Flor tejida en la parte frontal y perlas en la parte trasera, forro. Cierre: botón de perla', 18, 9, '2025-05-14 23:58:49.000', '2025-05-15 00:23:35.000', 'carteras', 'rojo_oscuro', 5, 21, 'hilo nylon', 'cadena doble dorada 43cm', 18),
(15, 'Margarita', 'Forro, flor Margarita grande blanca a ambos lados', 15, 11, '2025-05-15 00:01:14.000', '2025-05-15 00:16:08.000', 'bolsos', 'nude', 5, 21, 'hilo macramé', 'Aros de madera estilo natural', 21),
(16, 'Lozen', 'forro de fieltro con bolsillo interior. Cierre: broche de imán.', 20, 6, '2025-05-15 00:03:37.000', '2025-05-15 00:03:37.000', 'carteras', 'cafe', 7, 20, 'tela típica, cuero sintético', 'Cadena dorada, maderas de colores, 85cm', 30),
(17, 'Audrey', 'Cierre: tipo clutch de metal dorado.', 15, 6, '2025-05-15 00:07:02.000', '2025-05-15 00:08:41.000', 'carteras', 'cafe', 10, 18, 'macramé', 'Cadena dorada 90cm', 26),
(18, 'Jazmín', 'Forro y bolsillo interior, flores con hojitas tejidas a ambos lados. Cierre: broche metálico dorado.', 12, 8, '2025-05-15 00:18:10.000', '2025-05-15 00:18:32.000', 'bolsos', 'crema', 6, 24, NULL, 'Cadena dorada y perlas 80cm', 24),
(19, 'Michelle', 'Forro con bolsillo interior. Cierre: broche imán.', 8, 10, '2025-05-15 00:22:04.000', '2025-05-17 20:09:30.818', 'carteras', 'rojo_oscuro', 5, 20, 'trapillo', 'Tejida a trapillo 60cm.', 24);

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
(205, '/uploads/d7240934-2abd-403b-ae21-95e6c16f77e2.png', 1, 11, '2025-05-14 23:49:31.375'),
(206, '/uploads/45367d36-8486-466b-af5b-c81a09c4dc8b.png', 0, 11, '2025-05-14 23:49:31.375'),
(207, '/uploads/127f4b43-2d6c-4ef8-ab49-746886508d34.png', 0, 11, '2025-05-14 23:49:31.375'),
(208, '/uploads/22668e82-4f5d-489e-ac95-6cc5a23dc6cc.png', 0, 11, '2025-05-14 23:49:31.375'),
(209, '/uploads/e3d78481-272d-4474-9cf7-58cd6136338f.png', 0, 11, '2025-05-14 23:49:31.375'),
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
(239, '/uploads/27117f0f-5bd6-41fa-9211-b32a556940d1.png', 0, 16, '2025-05-15 00:03:37.496'),
(240, '/uploads/28b60d0e-8114-4889-9a7e-ab81404a912b.png', 1, 16, '2025-05-15 00:03:37.496'),
(241, '/uploads/df6e3f7e-5fd4-4deb-b81b-6c49aee6f422.png', 0, 16, '2025-05-15 00:03:37.496'),
(250, '/uploads/d113598c-640f-48d8-ac35-87c0bf1d3751.png', 1, 17, '2025-05-15 00:08:41.264'),
(251, '/uploads/552f399b-45f9-4af1-b09f-56ae7905f23e.png', 0, 17, '2025-05-15 00:08:41.264'),
(252, '/uploads/af342acd-ee8b-4504-b4e6-52f80d2369e3.png', 0, 17, '2025-05-15 00:08:41.264'),
(253, '/uploads/bd6037e5-14c4-4ee8-9b21-4a8b55b6763d.png', 0, 17, '2025-05-15 00:08:41.264'),
(254, '/uploads/94256417-41e2-4e3c-9877-271d4653a9c4.png', 0, 15, '2025-05-15 00:16:08.110'),
(255, '/uploads/2cf945b3-f59e-4747-8b4e-43f942429ddf.png', 0, 15, '2025-05-15 00:16:08.110'),
(256, '/uploads/3e0cfe33-2067-46d0-a27c-3c6f5b0b72ad.png', 1, 15, '2025-05-15 00:16:08.110'),
(257, '/uploads/ac596d28-60db-444c-a551-2767c3dd4bdc.png', 0, 15, '2025-05-15 00:16:08.110'),
(258, '/uploads/1819239d-69e7-46aa-9c76-4cd4565fb334.png', 0, 15, '2025-05-15 00:16:08.110'),
(265, '/uploads/693858a1-ca8d-4867-9d14-5cbc3b00e635.png', 0, 18, '2025-05-15 00:18:32.157'),
(266, '/uploads/131661c3-92a3-49e7-9810-0881834cac5c.png', 0, 18, '2025-05-15 00:18:32.157'),
(267, '/uploads/bfcf9c66-6ce1-4d8e-9d24-35c874d39947.png', 0, 18, '2025-05-15 00:18:32.157'),
(268, '/uploads/f384b019-34de-4a68-a1e6-f774a2200d2e.png', 1, 18, '2025-05-15 00:18:32.157'),
(269, '/uploads/091d2bad-ea1c-41a3-b3a6-25daebde56f5.png', 0, 18, '2025-05-15 00:18:32.157'),
(270, '/uploads/62be4bde-a26f-4805-99e4-5e71943c0dc4.png', 0, 18, '2025-05-15 00:18:32.157'),
(279, '/uploads/ac5486fa-5ba2-4145-98fd-c2722e61c270.png', 0, 14, '2025-05-15 00:23:35.270'),
(280, '/uploads/90c9ebfd-c2e1-498d-9bc0-9479150a6a2f.png', 0, 14, '2025-05-15 00:23:35.270'),
(281, '/uploads/fc9694da-3746-4784-bb11-7f82533878ce.png', 1, 14, '2025-05-15 00:23:35.270'),
(298, '/uploads/1f6344d5-2b49-48f2-b27c-4f32199a8802.png', 0, 19, '2025-05-17 20:09:30.834'),
(299, '/uploads/a2420bf3-c714-4d2a-bafb-df006cd05ede.png', 1, 19, '2025-05-17 20:09:30.834'),
(300, '/uploads/853c1a7c-a761-4451-9d40-6c943e62bbf5.png', 0, 19, '2025-05-17 20:09:30.834'),
(301, '/uploads/50d96798-fe5f-47dc-beb3-4cbbdc30cedd.png', 0, 19, '2025-05-17 20:09:30.834');

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
(77, 11, 8, 0),
(79, 12, 9, 0),
(80, 13, 8, 0),
(83, 16, 11, 0),
(84, 16, 12, 0),
(86, 17, 13, 0),
(87, 15, 9, 0),
(90, 14, 10, 0),
(95, 19, 8, 0);

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
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `zipCode` varchar(191) DEFAULT NULL,
  `lastLogin` datetime(3) DEFAULT NULL,
  `totalOrders` int(11) NOT NULL DEFAULT 0,
  `totalSpent` double NOT NULL DEFAULT 0,
  `reviewsCount` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `nombres`, `apellidos`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `avatar`, `phone`, `address`, `city`, `state`, `zipCode`, `lastLogin`, `totalOrders`, `totalSpent`, `reviewsCount`) VALUES
(1, 'Admin', 'Sistema', 'admin@example.com', '$2b$10$Sa2xVY7k.2oRpOaKLTMcCubD1uKTnK2e028f/20FAVypYXhHTkhlK', 'ADMIN', '2025-04-22 01:03:13.392', '2025-04-22 01:03:13.392', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(2, 'Usuario', 'Regular', 'user@example.com', '$2b$10$fZJyDQ1o8qCPUo2QhIv1IeNJGeugFH1VifhZgv5Y.GETwSxey9.8S', 'USER', '2025-04-22 01:03:13.408', '2025-04-22 01:03:13.408', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(8, 'marti', 'marti', 'marti@gmail.com', '$2b$12$MStexrW4VkTGSnJmLaOsNO/I5akWljG0QAlmR.60DwXOZjsHJHdcq', 'USER', '2025-04-30 00:57:33.093', '2025-04-30 00:57:33.093', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0),
(9, 'kevin', 'kevin', 'kevin@gmail.com', '$2b$12$HLEXpKpdGxuZZH2HBoPOJecmBi9QvTfips.s/MoamS.OH3JzPeWRe', 'USER', '2025-04-30 14:37:34.779', '2025-04-30 14:37:34.779', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0);

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
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `material`
--
ALTER TABLE `material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `productimage`
--
ALTER TABLE `productimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT de la tabla `productmaterial`
--
ALTER TABLE `productmaterial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

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
