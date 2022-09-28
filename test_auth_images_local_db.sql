CREATE DATABASE  IF NOT EXISTS `test_auth_images_local_db`;
USE `test_auth_images_local_db`;

-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: test_auth_images_local_db
-- ------------------------------------------------------
-- Server version	8.0.28


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
INSERT INTO `roles` VALUES (2001,'User','2022-09-23 09:14:02','2022-09-23 09:14:02',NULL),(5150,'Admin','2022-09-23 09:14:02','2022-09-23 09:14:02',NULL);
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refreshToken` varchar(255) DEFAULT '',
  `imageTitle` varchar(255) NOT NULL,
  `s3URL` varchar(255) NOT NULL DEFAULT 'Alex',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'alex1@gmail.com','$2b$10$f85PVURhC9FuiEziwt89/e93ReQ7JLVVWqmwuhft03FgrACPMzfDK','','178722cf-6368-4e12-9edd-81904b7259c4.jpg','https://user-images-s3-storage.s3.us-east-2.amazonaws.com/178722cf-6368-4e12-9edd-81904b7259c4.jpg','2022-09-23 09:14:02','2022-09-23 09:15:22',NULL);
UNLOCK TABLES;

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
INSERT INTO `user_roles` VALUES ('2022-09-23 09:14:02','2022-09-23 09:14:02',2001,1),('2022-09-23 09:14:02','2022-09-23 09:14:02',5150,1);
UNLOCK TABLES;




