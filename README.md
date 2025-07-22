# CoreChainServer — Blockchain-Based Human Resource Management System

## Overview

Deployed at: [https://corechain-server-deploy.onrender.com/](https://corechain-server-deploy.onrender.com/)

CoreChainServer is a modern Human Resource Management (HRM) backend system built with **NestJS** and integrated with **Blockchain** technology. The system aims to ensure transparency, secure sensitive employee data, and automate HR processes for small to medium-sized businesses.

## Key Features

* **Authentication & Authorization**: Secure user authentication with JWT and fine-grained role-based access control.
* **Blockchain Integration**: Uses Ethereum smart contracts (via Truffle & Web3) to store sensitive employee information and KPI contracts securely on the blockchain.
* **Modular Architecture**: Designed with Domain-Driven Design (DDD) and SOLID principles, each business function is implemented as a separate module.
* **Personnel Management**: Automates payroll calculation, salary adjustments, tax management, and handles contracts and allowances.
* **Performance Management**: Calculates KPIs, supports supervisor feedback, and generates performance reports.
* **Project & Task Management**: Built-in modules for managing projects, assigning tasks, and tracking progress without needing third-party tools.
* **Feedback System**: Allows employees to send anonymous feedback with an ID decryption process when necessary for security and compliance.
* **File Uploads**: Securely upload and store files using Cloudinary.

## Tech Stack

* **Backend**: NestJS (Node.js + TypeScript)
* **Blockchain**: Solidity smart contracts, Truffle, Ganache, Ethereum Sepolia Testnet, Web3.js / Ethers.js
* **Database**: MongoDB
* **API Documentation**: Swagger / OpenAPI, Compodoc
* **Testing**: Jest, Supertest
* **Real-Time**: Socket.io for WebSocket communication

## Modules

* **Auth Module**: Handles JWT login, refresh tokens, and secure session management.
* **User Module**: Manages public and private user data; integrates with the blockchain for sensitive data.
* **Blockchain Module**: Connects to Ethereum nodes, interacts with smart contracts for CRUD operations on employee data.
* **Personnel Module**: Automates salary, KPI, and salary advance requests.
* **Contracts Module**: Handles employee contracts, including expiration tracking.
* **Departments & Positions Modules**: Organizes employees and job roles.
* **Projects & Tasks Modules**: Enables internal project management and task assignment.
* **Feedback Module**: Manages employee feedback with robust anonymity controls.
* **Files Module**: Supports file uploads and storage via Cloudinary.
* **Roles & Permissions Modules**: Fine-grained access control for all APIs.
* **Reports Module**: Generates automated reports for HR metrics (attendance, KPI, salary, turnover, etc.).

## Security

* Uses **JWT** for authentication.
* **Bcrypt**, **SHA-256**, **MD5**, **AES-256-CBC**, and **RSA** for password hashing and data encryption.
* Blockchain ensures data immutability and integrity for critical employee information.

## Deployment

* Supports deployment with Render.com (render.yaml included).
* Modular codebase for easy maintenance and future expansion.

## Get Started

```bash
# Install dependencies
npm install

# Run in development
npm run start:dev

# Build and start in production
npm run build
npm run start:prod
```

## Authors

* Developed by Cao Nguyen Tri Ngoc and the Not Found Team.

## License

This project is for educational and research purposes. For production usage, please customize and extend responsibly.

---
