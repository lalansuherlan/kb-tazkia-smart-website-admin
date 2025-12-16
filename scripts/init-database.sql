-- Create database tables for KB Tazkia Smart Admin Dashboard

-- Admin Users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'staff') DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PPDB Applications table
CREATE TABLE IF NOT EXISTS ppdb_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  child_name VARCHAR(255) NOT NULL,
  child_dob DATE NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  program_category ENUM('kelompok_bermain', 'preschool', 'kelas_a', 'kelas_b') NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'waiting_list') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery Images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Page Content table
CREATE TABLE IF NOT EXISTS page_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_name VARCHAR(100) NOT NULL UNIQUE,
  section_name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 'admin123' hashed with bcrypt)
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@kbtazkia.id', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/shaIam9Ui', 'Admin KB Tazkia', 'admin');

-- Insert default programs
INSERT INTO programs (name, description, icon, order_index) VALUES
('Kelompok Bermain', 'Usia 1-2 tahun', '🥚', 1),
('Playgroup', 'Usia 2-3 tahun', '🐤', 2),
('TK A', 'Usia 3-4 tahun', '🦉', 3),
('TK B', 'Usia 4-5 tahun', '🦁', 4);
