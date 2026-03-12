const fs = require('fs');
const path = require('path');

// Extracting generated UUIDs from our previous scripts
const departments = [
  '1b7db7bd-31ed-4ec4-ab05-3e28cddbd471', // Board of Directors
  'a2bf9c56-347b-4022-b5e0-1d8dd22b8eb3', // Administration
  '34d49a40-2b15-46f9-8d76-e82b0f4d36eb', // Human Resources
  '8976b328-ee18-4e35-aeec-b9a35e9f85c7', // Legal
  '58aef6a2-6f29-4ccb-b0dd-fb69b76e5d26', // Accounting
  '78dbd5b5-e01e-450a-ae8e-20a221f7eead', // Finance
  'd4e16ffc-05f3-4ca7-b2e1-afcd7d8ba1bb', // Purchasing
  'cc977f68-fb9f-4328-9cce-70ebf1ea4be7', // Sales
  '4ebda0cb-5843-41bd-b873-16a704e6c310', // Marketing
  '8bcf62b7-a37a-4ecb-9fca-d84bf4184c7e', // Customer Service
  'bc33bba7-1b32-4dcf-8e7c-ed779427e5fe', // Information Technology
  '1bde8eeb-4389-4b68-80f4-5f53d100c598', // Research and Development
  '6c3a6e9a-54eb-4a1d-a041-0777e5ee5a1b', // Quality Assurance & Control
  '3a8122a9-c290-4d57-8fb2-c7fb555e884b', // Operations
  'e9d1a100-84a1-4eaa-b45b-d0e513a52e1f', // Public Relations
];

const positions = [
  '09c6218d-f5f4-4a49-aeb5-3d92fb142a22', // CEO
  '919b3a99-9686-4f40-8488-8cd4e44dc46a', // CTO
  'c64483a9-3add-45e0-9ec8-cc5b6dc517ce', // CFO
  '31c3bf75-01dc-49e0-84a1-8d2bafe588a4', // Department Manager
  'f8fbda5b-e4a8-444a-bee6-ce74b9a11786', // Team Lead
  '9cb78105-02b4-4e20-91c6-2c5e53e1be1a', // Tech Lead
  'dc5dcf23-5eac-4e42-afd8-27b2cd9eb556', // Developer
  '909618b7-6de5-4556-a19c-85a7bb4331ee', // HR Officer
  '90bb3fdc-2b22-42fe-bd34-97843ddde7a4', // Accountant
  '24b42b66-0775-4c07-ae7c-50a0f0dd18ec', // Designer
  '48b111db-ec0b-4876-b333-fede8dbbac44', // Sales Executive
  '12d2ad31-8977-4c4c-bbc2-3783a54b3706', // Intern
  'a7d18831-2921-4dca-97ce-ec9cf43f5f61', // Freelancer
];

const roles = [
  '6efe0f08-cafd-48b7-a56f-6d19476802a8', // Super Admin
  'a92e12c6-2ea1-4d8f-8d9f-cf55542c982f', // HR Admin
  '4edcd1a1-6768-4a41-8209-0470fd1e283c', // Manager
  '10ba36e1-7841-44fd-b2e4-01a05e6b780a', // Employee
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const users = [];

for (let i = 1; i <= 50; i++) {
  const fName = getRandomItem(firstNames);
  const lName = getRandomItem(lastNames);
  const fullName = `${fName} ${lName}`;
  const isMale = Math.random() > 0.5;

  const employeeId = `EMP${String(i).padStart(4, '0')}`;
  
  // Date of birth: 1970 - 2005
  const year = getRandomNumber(1970, 2005);
  const month = String(getRandomNumber(1, 12)).padStart(2, '0');
  const day = String(getRandomNumber(1, 28)).padStart(2, '0');
  
  const user = {
    name: fullName,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@corechain.com`,
    password: '123456', // Requested default password
    role: getRandomItem(roles),
    workingHours: getRandomNumber(30, 40),
    employeeId: employeeId,
    position: getRandomItem(positions),
    department: getRandomItem(departments),
    netSalary: getRandomNumber(3000, 15000),
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Default placeholder
    personalIdentificationNumber: `${getRandomNumber(100000000, 999999999)}`,
    dateOfBirth: `${year}-${month}-${day}T00:00:00.000Z`,
    personalPhoneNumber: `+1` + getRandomNumber(2000000000, 9999999999).toString(),
    male: isMale,
    nationality: 'American',
    permanentAddress: `${getRandomNumber(1, 9999)} Main St, Cityville, State, 12345`,
    biometricData: 'base64_fake_data_string_xyz',
    employeeContractCode: `CTR-${employeeId}`,
    salary: getRandomNumber(3000, 15000),
    allowances: getRandomNumber(200, 1000),
    adjustments: [],
    loansSupported: 0,
    healthCheckRecordCode: [`HC-${year}-${month}`],
    medicalHistory: 'None',
    healthInsuranceCode: `HI${getRandomNumber(100000, 999999)}`,
    lifeInsuranceCode: `LI${getRandomNumber(100000, 999999)}`,
    socialInsuranceNumber: `SSN${getRandomNumber(10000000, 99999999)}`,
    personalTaxIdentificationNumber: `TIN${getRandomNumber(100000000, 999999999)}`,
    backAccountNumber: `${getRandomNumber(100000000000, 999999999999)}`
  };

  users.push(user);
}

const outputPath = path.join(__dirname, 'postman_users.json');
fs.writeFileSync(outputPath, JSON.stringify(users, null, 2));

console.log(`Successfully generated 50 users in ${outputPath}`);
console.log('You can copy the contents of this JSON file directly into Postman as a raw JSON body, or use the Postman Runner feature to inject the JSON array into your Create User endpoint!');
