/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100428
 Source Host           : localhost:3306
 Source Schema         : kb_tazkia_smart

 Target Server Type    : MySQL
 Target Server Version : 100428
 File Encoding         : 65001

 Date: 11/12/2025 16:25:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_users
-- ----------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `role` enum('admin','teacher','staff') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin_users
-- ----------------------------
INSERT INTO `admin_users` VALUES (2, 'guru@kbtazkia.id', '$2b$10$dXJ3sF8Q2p9K5vN8mL2C9eIjZAgcg7b3XeKeUxWdeS86E36P4/sha', 'Guru KB Tazkia', 'teacher', '2025-12-08 17:16:20', '2025-12-08 17:16:20');
INSERT INTO `admin_users` VALUES (3, 'staff@kbtazkia.id', '$2b$10$dXJ3sF8Q2p9K5vN8mL2C9eIjZAgcg7b3XeKeUxWdeS86E36P4/sha', 'Staff KB Tazkia', 'staff', '2025-12-08 17:16:20', '2025-12-08 17:16:20');
INSERT INTO `admin_users` VALUES (4, 'admin@kbtazkia.id', '$2b$10$p9z8pfwJJ1ifVB08ESkKZ.MBiPyFyUCngMOXBUpfcyDzfY.qHXCV2', 'Admin KB Tazkia', 'admin', '2025-12-08 17:20:39', '2025-12-08 17:20:39');
INSERT INTO `admin_users` VALUES (5, 'lalan@gsp.co.id', '$2b$10$aW4FIQNrtrLm6O271y.enebSGsfqeW0fHpE5jZlEEBTxKlecNyOx2', 'Lalan Suherlan', 'admin', '2025-12-11 11:14:38', '2025-12-11 11:14:38');

-- ----------------------------
-- Table structure for gallery_images
-- ----------------------------
DROP TABLE IF EXISTS `gallery_images`;
CREATE TABLE `gallery_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `emoji` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '?',
  `order_index` int NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of gallery_images
-- ----------------------------
INSERT INTO `gallery_images` VALUES (1, 'Bermain Sambil Belajar', 'Aktivitas seru dengan karakter teman', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', 'kegiatan', '🦆', 1, '2025-12-10 15:47:16', '2025-12-10 15:47:16');
INSERT INTO `gallery_images` VALUES (2, 'Aktivitas Kreatif', 'Mengembangkan kreativitas anak', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', 'kreativitas', '🦋', 2, '2025-12-10 15:47:16', '2025-12-10 16:11:11');
INSERT INTO `gallery_images` VALUES (3, 'Olahraga Bersama', 'Bermain sehat dan aktif', 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67', 'olahraga', '🐰', 3, '2025-12-10 15:47:16', '2025-12-10 15:47:16');
INSERT INTO `gallery_images` VALUES (4, 'Pembelajaran Kelompok', 'Belajar sambil bersosialisasi', 'https://images.unsplash.com/photo-1588072432836-e10032774350', 'belajar', '🦁', 4, '2025-12-10 15:47:16', '2025-12-10 15:47:16');
INSERT INTO `gallery_images` VALUES (5, 'Acara Spesial', 'Momen berkesan bersama teman', 'https://images.unsplash.com/photo-1530099486328-e021101a494a', 'acara', '🦜', 5, '2025-12-10 15:47:16', '2025-12-10 15:47:16');
INSERT INTO `gallery_images` VALUES (6, 'Kegiatan Outdoor', 'Eksplorasi di alam terbuka', 'https://images.unsplash.com/photo-1610484826967-09c5720778c7', 'outdoor', '🌿', 6, '2025-12-10 15:47:16', '2025-12-10 15:47:16');

-- ----------------------------
-- Table structure for page_content
-- ----------------------------
DROP TABLE IF EXISTS `page_content`;
CREATE TABLE `page_content`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `section_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `title` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `content` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `image_url` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_page_section`(`page_name`, `section_name`) USING BTREE,
  UNIQUE INDEX `idx_page_section`(`page_name`, `section_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of page_content
-- ----------------------------
INSERT INTO `page_content` VALUES (1, 'home', 'hero', 'Taman Cerdas untuk Buah Hati Anda', 'Lingkungan belajar yang menyenangkan dengan pendekatan holistik. Kami menumbuhkan kebahagiaan, kreativitas, dan potensi setiap anak.', 'https://images.unsplash.com/photo-1530099486328-e021101a494a', '2025-12-10 16:17:30', '2025-12-11 15:38:11');
INSERT INTO `page_content` VALUES (5, 'home', 'about', 'Membangun Generasi Cerdas dan Berkarakter', 'KB Tazkia Smart berkomitmen memberikan pendidikan berkualitas tinggi yang mengintegrasikan nilai-nilai akhlak, keterampilan akademik, dan pengembangan karakter sejak dini dengan suasana yang ceria dan menyenangkan seperti di taman bermain.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', '2025-12-10 16:33:44', '2025-12-10 16:36:01');

-- ----------------------------
-- Table structure for ppdb_applications
-- ----------------------------
DROP TABLE IF EXISTS `ppdb_applications`;
CREATE TABLE `ppdb_applications`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `program_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `child_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `child_birth_date` date NOT NULL,
  `child_gender` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `parent_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `parent_phone` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `parent_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `address` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `notes` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` enum('pending','approved','rejected','waiting_list','enrolled') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ppdb_applications
-- ----------------------------

-- ----------------------------
-- Table structure for ppdb_categories
-- ----------------------------
DROP TABLE IF EXISTS `ppdb_categories`;
CREATE TABLE `ppdb_categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `age_range` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `emoji` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '?',
  `color_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'from-blue-200/50 to-cyan-200/50',
  `benefits` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `is_popular` tinyint(1) NULL DEFAULT 0,
  `order_index` int NULL DEFAULT 0,
  `short_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `full_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `objectives` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `curriculum` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `schedule` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `costs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `requirements` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `admission` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ppdb_categories
-- ----------------------------
INSERT INTO `ppdb_categories` VALUES (1, 'Kelompok Bermain 123', '2 - 3 Tahun', '🐣', 'from-yellow-200/50 to-orange-200/50', '[\"Adaptasi sosial awal\",\"Bermain sensori\",\"Aktivitas ringan\"]', 0, 1, 'Program pengenalan dan adaptasi sosial untuk anak usia dini 123', 'Program Kelompok Bermain dirancang khusus untuk anak berusia 2-3 tahun. Program ini fokus pada pengenalan lingkungan, adaptasi sosial, dan pembelajaran melalui bermain. 123', '[\"Membantu anak beradaptasi dengan lingkungan sekolah\",\"Mengembangkan keterampilan sosial dasar\",\"Merangsang kreativitas dan imajinasi melalui bermain\",\"Mengenalkan anak pada rutinitas sekolah\",\"Membangun ikatan emosional yang positif\"]', '{\"title\":\"Kurikulum & Aktivitas\",\"items\":[\"Sensory Play\",\"Music & Movement\",\"Art & Craft\",\"Story Time\",\"Free Play\",\"Snack Time\"]}', '[\"Ruang kelas aman\",\"Area bermain indoor\",\"Area bermain outdoor\",\"Toilet anak\",\"Dapur snack\"]', '{\"regular\":\"Senin - Jumat, 08:00 - 11:00\",\"fullday\":\"Senin - Jumat, 08:00 - 15:00\",\"entrance\":\"08:00 WIB\",\"pickup\":\"11:00 / 15:00 WIB\"}', '{\"registration\":\"Rp 500.000\",\"monthly\":\"Rp 800.000\",\"yearly\":\"Rp 7.500.000\",\"additional\":\"Biaya seragam dan alat tulis\"}', '[\"Fotokopi akta kelahiran\",\"Fotokopi KK\",\"Fotokopi KTP Orang Tua\",\"Pasfoto 4x6\"]', 'Pendaftaran dibuka Januari - Agustus');
INSERT INTO `ppdb_categories` VALUES (2, 'Playgroup', '3 - 4 Tahun', '🐤', 'from-orange-200/50 to-emerald-200/50', '[\"Pembelajaran akademik dasar\", \"Musik dan seni\", \"Aktivitas motorik\"]', 1, 2, 'Program pembelajaran awal dengan fokus akademik dan sosial', 'Program Playgroup untuk anak 3-4 tahun dengan fokus pada pembelajaran akademik dasar, keterampilan sosial, dan pengembangan motorik.', '[\"Mengembangkan keterampilan akademik dasar\", \"Meningkatkan motorik halus kasar\", \"Kemampuan bahasa\"]', '{\"title\": \"Kurikulum & Metode\", \"items\": [\"Huruf & Angka\", \"Seni\", \"Musik\", \"Motorik Kasar\", \"Motorik Halus\"]}', '[\"Kelas modern\", \"Perpustakaan mini\", \"Playground\", \"Ruang seni\"]', '{\"regular\": \"Senin - Jumat, 08:00 - 11:30\", \"fullday\": \"08:00 - 15:00\", \"entrance\": \"08:00\", \"pickup\": \"11:30 / 15:00\"}', '{\"registration\": \"Rp 750.000\", \"monthly\": \"Rp 1.200.000\", \"yearly\": \"Rp 11.000.000\", \"additional\": \"Seragam dan buku\"}', '[\"Akta\", \"KK\", \"KTP\", \"Foto\"]', 'Pendaftaran dibuka Januari - Agustus');
INSERT INTO `ppdb_categories` VALUES (3, 'TK A', '4 - 5 Tahun', '🦜', 'from-emerald-200/50 to-cyan-200/50', '[\"Akademik lanjutan\", \"Persiapan membaca\", \"Keterampilan sosial\"]', 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `ppdb_categories` VALUES (4, 'TK B', '5 - 6 Tahun', '🦁', 'from-cyan-200/50 to-blue-200/50', '[\"Pre-akademik\", \"Persiapan SD\", \"Leadership skills\"]', 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for programs
-- ----------------------------
DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bg_emoji` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '✨',
  `color_class` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'from-green-100 to-emerald-100',
  `order_index` int NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of programs
-- ----------------------------
INSERT INTO `programs` VALUES (1, 'Program Akademik', 'Pembelajaran interaktif dengan metode modern yang menyenangkan.', '📚', '🦆', 'from-blue-400 to-cyan-400', 0, '2025-12-10 15:26:37', '2025-12-10 15:44:02');
INSERT INTO `programs` VALUES (2, 'Seni & Kreativitas', 'Kelas melukis, meramu, dan mengekspresikan imajinasi anak.', '🎨', '🦋', 'from-purple-400 to-pink-400', 2, '2025-12-10 15:26:37', '2025-12-10 15:27:52');
INSERT INTO `programs` VALUES (3, 'Motorik & Olahraga', 'Aktivitas fisik seru untuk mengembangkan kekuatan dan kesehatan.', '⚽', '🐰', 'from-orange-400 to-yellow-400', 3, '2025-12-10 15:26:37', '2025-12-10 15:27:51');
INSERT INTO `programs` VALUES (4, 'Sosial & Emosional', 'Membangun karakter, empati, dan keterampilan bermasyarakat.', '❤️', '🦁', 'from-red-300 to-pink-300', 4, '2025-12-10 15:26:37', '2025-12-10 15:27:49');

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ppdb_id` int NULL DEFAULT NULL,
  `nis` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nisn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `birth_place` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `birth_date` date NOT NULL,
  `gender` enum('L','P') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `class_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `program_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `academic_year` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('active','graduated','moved','dropped_out') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'active',
  `parent_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `nis`(`nis`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of students
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
