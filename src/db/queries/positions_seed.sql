-- Positions Seed Script
-- Levels: 1 - C-Level, 2 - Management, 3 - Staff, 4 - Suppport, Others

SET @NOW = NOW();

-- Level 1: C-Level
INSERT INTO `positions` (`_id`, `title`, `description`, `parentId`, `level`, `isDeleted`, `createdAt`, `updatedAt`) VALUES 
('09c6218d-f5f4-4a49-aeb5-3d92fb142a22', 'CEO', 'Chief Executive Officer', NULL, 1, 0, @NOW, @NOW),
('919b3a99-9686-4f40-8488-8cd4e44dc46a', 'CTO', 'Chief Technology Officer', '09c6218d-f5f4-4a49-aeb5-3d92fb142a22', 1, 0, @NOW, @NOW),
('c64483a9-3add-45e0-9ec8-cc5b6dc517ce', 'CFO', 'Chief Financial Officer', '09c6218d-f5f4-4a49-aeb5-3d92fb142a22', 1, 0, @NOW, @NOW);

-- Level 2: Management
INSERT INTO `positions` (`_id`, `title`, `description`, `parentId`, `level`, `isDeleted`, `createdAt`, `updatedAt`) VALUES 
('31c3bf75-01dc-49e0-84a1-8d2bafe588a4', 'Department Manager', 'Department Manager', '09c6218d-f5f4-4a49-aeb5-3d92fb142a22', 2, 0, @NOW, @NOW),
('f8fbda5b-e4a8-444a-bee6-ce74b9a11786', 'Team Lead', 'Team Lead', '31c3bf75-01dc-49e0-84a1-8d2bafe588a4', 2, 0, @NOW, @NOW),
('9cb78105-02b4-4e20-91c6-2c5e53e1be1a', 'Tech Lead', 'Tech Lead', '919b3a99-9686-4f40-8488-8cd4e44dc46a', 2, 0, @NOW, @NOW);

-- Level 3: Staff
INSERT INTO `positions` (`_id`, `title`, `description`, `parentId`, `level`, `isDeleted`, `createdAt`, `updatedAt`) VALUES 
('dc5dcf23-5eac-4e42-afd8-27b2cd9eb556', 'Developer', 'Developer', '9cb78105-02b4-4e20-91c6-2c5e53e1be1a', 3, 0, @NOW, @NOW),
('909618b7-6de5-4556-a19c-85a7bb4331ee', 'HR Officer', 'HR Officer', '31c3bf75-01dc-49e0-84a1-8d2bafe588a4', 3, 0, @NOW, @NOW),
('90bb3fdc-2b22-42fe-bd34-97843ddde7a4', 'Accountant', 'Accountant', 'c64483a9-3add-45e0-9ec8-cc5b6dc517ce', 3, 0, @NOW, @NOW),
('24b42b66-0775-4c07-ae7c-50a0f0dd18ec', 'Designer', 'Designer', '9cb78105-02b4-4e20-91c6-2c5e53e1be1a', 3, 0, @NOW, @NOW),
('48b111db-ec0b-4876-b333-fede8dbbac44', 'Sales Executive', 'Sales Executive', 'f8fbda5b-e4a8-444a-bee6-ce74b9a11786', 3, 0, @NOW, @NOW);

-- Level 4: Support, Others
INSERT INTO `positions` (`_id`, `title`, `description`, `parentId`, `level`, `isDeleted`, `createdAt`, `updatedAt`) VALUES 
('12d2ad31-8977-4c4c-bbc2-3783a54b3706', 'Intern', 'Intern', '9cb78105-02b4-4e20-91c6-2c5e53e1be1a', 4, 0, @NOW, @NOW),
('a7d18831-2921-4dca-97ce-ec9cf43f5f61', 'Freelancer', 'Freelancer', '31c3bf75-01dc-49e0-84a1-8d2bafe588a4', 4, 0, @NOW, @NOW);
