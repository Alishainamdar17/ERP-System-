🚛 ERP Dispatch & Fleet Management System
<p align="center"> <img src="https://img.shields.io/badge/Java-Spring%20Boot-green?style=for-the-badge&logo=springboot"/> <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react"/> <img src="https://img.shields.io/badge/PostgreSQL-Database-orange?style=for-the-badge&logo=postgresql"/> <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge"/> </p>
📌 Overview

The ERP Dispatch & Fleet Management System is a full-stack enterprise application designed for logistics and transport operations. It centralizes dispatching, fleet tracking, planning, HR, accounts, and reporting into a single integrated platform.

It provides real-time operational visibility, workflow automation, and structured reporting across multiple departments.

🔗 Live Demo: https://onedlfs.netlify.app
🔗 Backend Repository: https://github.com/Alishainamdar17/Dispatch_system

⚙️ Tech Stack
Layer	Technology
Frontend	React.js, Tailwind CSS
Backend	Java, Spring Boot (REST APIs)
Database	PostgreSQL
Auth	Basic Auth (JWT planned)
Deployment	Netlify (Frontend), Render / Local Server
Build Tools	Maven, npm
Versioning	Git & GitHub
🧩 Core Modules
🚚 Dispatch & Fleet Management
Vehicle assignment & tracking
Trip creation, updates, and cancellations
Live tracking support
Fuel & expense management
Driver activity monitoring
👨‍✈️ Driver Module
Driver dashboard
Trip history & performance
Expense submission
Vehicle condition image uploads
Break management system
📦 Coordinator Module
Work order management
Info sheets & tracker sheets
Progress monitoring dashboards
Inter-department coordination
🏗️ Planning Module
Project & work structure management
Line-item planning system
PDF schedule generation (PDFBox)
Planning history tracking
👔 Boss / PA Module
Appointment scheduling system
Role-based dashboards
Notification system for BOSS role
📑 Requisition System
Vehicle requisition creation & approvals
Grouped requisition workflows
📁 Project Records
File uploads (plans, documents, images)
Production record tracking
🏗️ System Architecture
Frontend: React SPA with role-based routing
Backend: Spring Boot REST API (monolithic structure)
Database: PostgreSQL with Hibernate ORM
File Storage: Database BLOB storage (planned migration to S3)
Communication: REST APIs over HTTP
🔐 Authentication & Security

⚠️ Current state is development-only and NOT production-ready.

Plain-text password storage (no hashing)
No JWT/session security enforcement
All APIs currently publicly accessible
Client-side role handling only
Planned Improvements
JWT-based authentication
BCrypt password hashing
Role-based access control (RBAC)
Secure token storage (HttpOnly cookies)
🚀 Getting Started
Backend Setup
# Requirements
- Java 17+
- Maven
- PostgreSQL

# Run backend
mvn spring-boot:run

Default admin:

eCode: 1001
password: admin@123
Frontend Setup
npm install
npm start

Runs on:

http://localhost:3000
Database

Create PostgreSQL database:

CREATE DATABASE onedeoleela;

Configure in environment variables:

DATASOURCE_URL
DATASOURCE_USER
DATASOURCE_PASSWORD
🌐 Deployment
Backend
mvn clean package
java -jar target/app.jar
Frontend
npm run build

Deploy build/ folder to:

Nginx / Apache
Netlify / S3 / static hosting
⚠️ Known Issues
Security
No authentication enforcement at API level
Plain-text passwords
LocalStorage session storage
Architecture
Large monolithic components in React
No centralized API configuration
Files stored as DB BLOBs (scalability issue)
No migration tool (Flyway/Liquibase missing)
Performance
Some large data tables lack pagination
Limited search/filter support
🧭 Roadmap
 Implement JWT authentication
 Add RBAC (role-based access control)
 Move file storage to AWS S3
 Introduce pagination & filters
 Add centralized API service layer
 Add unit & integration tests
 Improve modular frontend architecture
 Add email notifications
📄 License

This project is currently proprietary / internal use (update if open-source).

⭐ Acknowledgement

If this system helps your workflow or learning, consider starring the repository.

🔥 What I improved
Reduced size by ~60%
Removed repetitive endpoint dumps
Improved readability and hierarchy
Added roadmap + architecture clarity
Made it recruiter / reviewer friendly
Separated “dev issues” from “features”
