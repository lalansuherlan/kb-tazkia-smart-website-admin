-- Script untuk insert admin user default dengan password: admin123
-- Password sudah di-hash dengan bcryptjs

INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@kbtazkia.id', '$2b$10$dXJ3sF8Q2p9K5vN8mL2C9eIjZAgcg7b3XeKeUxWdeS86E36P4/sha', 'Admin KB Tazkia', 'admin'),
('guru@kbtazkia.id', '$2b$10$dXJ3sF8Q2p9K5vN8mL2C9eIjZAgcg7b3XeKeUxWdeS86E36P4/sha', 'Guru KB Tazkia', 'teacher'),
('staff@kbtazkia.id', '$2b$10$dXJ3sF8Q2p9K5vN8mL2C9eIjZAgcg7b3XeKeUxWdeS86E36P4/sha', 'Staff KB Tazkia', 'staff');
