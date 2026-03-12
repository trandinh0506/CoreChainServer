-- Departments Seed Script
-- Including: BOD, ADM, HR, Legal, ACC, FIN, PUR, SAL, MKT, CS, IT, R&D, QA/QC, PR, OPS

SET @NOW = NOW();

INSERT INTO `departments` (`_id`, `name`, `code`, `description`, `manager`, `employees`, `status`, `budget`, `projectIds`, `isDeleted`, `createdAt`, `updatedAt`) VALUES 
('1b7db7bd-31ed-4ec4-ab05-3e28cddbd471', 'Board of Directors', 'BOD', 'Top executives and directors.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('a2bf9c56-347b-4022-b5e0-1d8dd22b8eb3', 'Administration', 'ADM', 'General overall administration and facility management.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('34d49a40-2b15-46f9-8d76-e82b0f4d36eb', 'Human Resources', 'HR', 'Recruiting, personnel, salaries, and benefits management.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('8976b328-ee18-4e35-aeec-b9a35e9f85c7', 'Legal', 'LEG', 'Handles legal matters, contracts, and compliance.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('58aef6a2-6f29-4ccb-b0dd-fb69b76e5d26', 'Accounting', 'ACC', 'Accounts payable, accounts receivable, and bookkeeping.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('78dbd5b5-e01e-450a-ae8e-20a221f7eead', 'Finance', 'FIN', 'Financial planning, analysis, and strategy.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('d4e16ffc-05f3-4ca7-b2e1-afcd7d8ba1bb', 'Purchasing', 'PUR', 'Procurement of goods and services.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('cc977f68-fb9f-4328-9cce-70ebf1ea4be7', 'Sales', 'SAL', 'B2B and B2C sales operations.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('4ebda0cb-5843-41bd-b873-16a704e6c310', 'Marketing', 'MKT', 'Advertising, branding, and market research.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('8bcf62b7-a37a-4ecb-9fca-d84bf4184c7e', 'Customer Service', 'CS', 'Client support and customer satisfaction.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('bc33bba7-1b32-4dcf-8e7c-ed779427e5fe', 'Information Technology', 'IT', 'Network, infrastructure, software, and hardware support.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('1bde8eeb-4389-4b68-80f4-5f53d100c598', 'Research and Development', 'R&D', 'Innovation and new product development.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('6c3a6e9a-54eb-4a1d-a041-0777e5ee5a1b', 'Quality Assurance & Control', 'QA/QC', 'Quality testing and standard enforcement.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('3a8122a9-c290-4d57-8fb2-c7fb555e884b', 'Operations', 'OPS', 'Day-to-day business operations and logistics.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW),
('e9d1a100-84a1-4eaa-b45b-d0e513a52e1f', 'Public Relations', 'PR', 'Media relations and public image management.', NULL, '[]', 'Active', 0, '[]', 0, @NOW, @NOW);
