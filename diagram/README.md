# HRM Blockchain System - UML Diagrams

This directory contains comprehensive UML diagrams for the CoreChainServer HRM system, documenting the architecture, workflows, and interactions of the blockchain-integrated human resource management system.

## 📊 Use Case Diagrams

### 1. Main System Overview
**File:** `use-case-main.puml`

Comprehensive overview showing all actors, modules, and use cases in the HRM system:
- **Actors:** Employee, HR Manager, Admin, System, Blockchain Network
- **Modules:** Authentication, User Management, Blockchain Integration, Personnel, Contracts, Departments, Projects, Tasks, Feedback, Notifications, Reports, Files, Security, Chat

### 2. Authentication Module
**File:** `use-case-authentication.puml`

Detailed authentication workflows including:
- Login with JWT token generation
- Account management with role-based permissions
- Token refresh mechanism
- Logout and session management
- Password change with bcrypt encryption

### 3. Employee Management
**File:** `use-case-employee-management.puml`

Employee CRUD operations with blockchain integration:
- User creation and data encryption
- Public data in MongoDB, private data on blockchain
- FCM token management for notifications
- Working hours tracking
- Blockchain operations (store, update, retrieve, deactivate)

### 4. Project & Task Management
**File:** `use-case-project-task.puml`

Project and task workflows with notification integration:
- Project creation and team management
- Task assignment and progress tracking
- Department linking
- Kafka-based notification triggers
- FCM push notifications to mobile apps

### 5. Notification System
**File:** `use-case-notifications.puml`

End-to-end notification architecture:
- FCM token registration and updates
- Kafka event publishing (NestJS)
- Golang notification service consumption
- FCM notification delivery
- PostgreSQL notification history

## 🔄 Sequence Diagrams

### 1. Authentication Flow
**File:** `sequence-authentication.puml`

Complete authentication lifecycle:
- Login with credential validation
- JWT and refresh token generation
- Token expiration and refresh
- Logout and session clearing
- Bcrypt password verification

### 2. Blockchain Employee Creation
**File:** `sequence-blockchain-employee.puml`

Employee data storage on Ethereum blockchain:
- Public data in MongoDB
- Private data encryption (AES-256-CBC)
- Smart contract interaction via Web3
- Transaction confirmation
- Data retrieval and decryption

### 3. Task Creation with Notifications
**File:** `sequence-task-notification.puml`

Full notification pipeline:
1. Task creation in NestJS backend
2. Kafka event publishing to `task.created` topic
3. Golang service consuming Kafka messages
4. FCM token lookup
5. Push notification via Firebase Admin SDK
6. PostgreSQL notification history
7. Mobile app notification handling

### 4. Contract Management
**File:** `sequence-contract-management.puml`

Employment contract lifecycle:
- Contract creation with blockchain hash storage
- SHA-256 hash for immutability
- Automated expiration tracking (cron jobs)
- Multi-stage reminder notifications
- Contract updates and termination

### 5. Anonymous Feedback System
**File:** `sequence-feedback.puml`

Privacy-focused feedback mechanism:
- Anonymous submission with ID encryption
- AES-256 employee ID encryption
- HR viewing without identity disclosure
- Admin-only ID decryption with audit trail
- Feedback response and resolution

### 6. File Upload Flow
**File:** `sequence-file-upload.puml`

Cloudinary integration for file management:
- Single and multiple file uploads
- Multer middleware processing
- Cloudinary cloud storage
- Automatic image optimization
- File metadata in MongoDB
- Secure file deletion

## 🚀 How to Use These Diagrams

### Viewing PlantUML Files

1. **Online Viewer:**
   - Visit [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
   - Copy and paste the `.puml` file content
   - View the rendered diagram

2. **VS Code Extension:**
   ```bash
   # Install PlantUML extension
   code --install-extension jebbs.plantuml
   ```
   - Open any `.puml` file
   - Press `Alt+D` to preview

3. **IntelliJ IDEA / WebStorm:**
   - Install PlantUML Integration plugin
   - Right-click `.puml` file → "View PlantUML Diagram"

4. **Command Line (requires Java and Graphviz):**
   ```bash
   # Install PlantUML
   npm install -g node-plantuml
   
   # Generate PNG from PUML
   puml generate diagram/use-case-main.puml -o output.png
   ```

### Exporting to Images

```bash
# Export all diagrams to PNG
java -jar plantuml.jar diagram/*.puml

# Export to SVG (vector format)
java -jar plantuml.jar -tsvg diagram/*.puml

# Export to PDF
java -jar plantuml.jar -tpdf diagram/*.puml
```

## 📋 Diagram Categories

### Use Case Diagrams
- System architecture overview
- Actor relationships
- Feature mappings
- Module interactions

### Sequence Diagrams
- Request-response flows
- Service interactions
- Database transactions
- Blockchain operations
- External API integrations

## 🔑 Key Technologies Documented

- **Backend:** NestJS, TypeScript
- **Blockchain:** Ethereum, Solidity, Web3.js
- **Database:** MongoDB, PostgreSQL
- **Message Queue:** Apache Kafka
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Microservices:** Golang notification service
- **Security:** JWT, Bcrypt, AES-256, RSA
- **Storage:** Cloudinary
- **Real-time:** Socket.io

## 📝 Notes

- All diagrams follow PlantUML syntax and best practices
- Diagrams are version-controlled and should be updated as the system evolves
- Each diagram includes relevant notes explaining key concepts
- Color coding and styling enhance readability
- Actors and components are consistently named across all diagrams

## 🔄 Updating Diagrams

When making changes to the system:
1. Update the corresponding `.puml` file
2. Verify syntax using PlantUML validator
3. Regenerate preview/images
4. Commit changes with descriptive message

## 📚 References

- [PlantUML Official Documentation](https://plantuml.com/)
- [PlantUML Use Case Diagram Guide](https://plantuml.com/use-case-diagram)
- [PlantUML Sequence Diagram Guide](https://plantuml.com/sequence-diagram)
- [CoreChainServer README](../README.md)

---

**Generated:** 2026-01-14  
**System:** CoreChainServer HRM Blockchain System  
**Author:** Not Found Team
