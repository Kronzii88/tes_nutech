-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 20, 2024 at 03:14 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tes_nutech`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `banner_name` varchar(30) DEFAULT NULL,
  `banner_image` text DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `banner_name`, `banner_image`, `description`) VALUES
(1, 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(2, 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(3, 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(4, 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(5, 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(6, 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_code` varchar(30) NOT NULL,
  `service_name` varchar(30) DEFAULT NULL,
  `service_icon` text DEFAULT NULL,
  `service_tarif` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_code`, `service_name`, `service_icon`, `service_tarif`) VALUES
(1, 'PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(2, 'PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
(3, 'PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(4, 'PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
(5, 'PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(6, 'MUSIK', 'Musik Belangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(7, 'TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(8, 'PAKET_DATA', 'Paket Data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
(9, 'VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
(10, 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
(11, 'QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
(12, 'ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `invoice_number` varchar(30) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `amount` float NOT NULL DEFAULT 0,
  `flag` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1. debit\n2. kredit',
  `insert_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `id_user`, `invoice_number`, `description`, `amount`, `flag`, `insert_at`) VALUES
(1, 2, 'INV20102024-001', 'Top Up balance', 1000000, 1, '2024-10-20 11:42:25'),
(3, 2, 'INV20102024-002', 'Pulsa', 40000, 2, '2024-10-20 12:50:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `first_name` varchar(30) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password` varbinary(100) NOT NULL,
  `profil_image` text DEFAULT NULL,
  `balance` float NOT NULL DEFAULT 0,
  `token` text DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT 1,
  `insert_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NULL DEFAULT NULL,
  `update_balance` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `profil_image`, `balance`, `token`, `status`, `insert_at`, `update_at`, `update_balance`) VALUES
(1, 'ezarofi88@gmail.com', 'ezyh', 'arofi', 0x929bbabaae56aa2c5e67846e4758c424, NULL, 0, NULL, 1, '2024-10-19 16:16:36', NULL, NULL),
(2, 'res.email@gmail.com', 'User Edited', 'Nutech Edited', 0x61e16a6ca9239d97957b81793d21a7cb, 'https://nutech.s3.ap-southeast-1.wasabisys.com/demo-image2.png-10031515', 960000, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyZXMuZW1haWxAZ21haWwuY29tIiwiaWF0IjoxNzI5NDAwNDI0LCJleHAiOjE3MzE5OTI0MjR9.spwy5F-pRLuTa-U1tQ7amvX0x_PL-Gf_iy4-8GV72d4', 1, '2024-10-20 04:40:25', '2024-10-20 05:00:24', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transactions_users_FK` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_users_FK` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
