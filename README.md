# 🚛 ERP Dispatch & Fleet Management System

<p align="center">
  <img src="https://img.shields.io/badge/Java-Spring%20Boot-green?style=for-the-badge&logo=springboot"/>
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react"/>
  <img src="https://img.shields.io/badge/MySQL-Database-orange?style=for-the-badge&logo=mysql"/>
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge"/>
</p>
 
---

## 📌 Project Overview

The **ERP Dispatch & Fleet Management System** is a full-stack enterprise resource planning application designed to automate and manage the complete operations of a transport/logistics business. It covers 12 integrated modules — from dispatch and fleet management to accounts, production, and HR — providing real-time visibility and control over every business function.

> 🌐 **Live Demo:** [onedlfs.netlify.app](https://onedlfs.netlify.app)  
> 📦 **Backend Repo:** [Dispatch_system](https://github.com/Alishainamdar17/Dispatch_system)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Java, Spring Boot, REST API |
| **Database** | MySQL |
| **Authentication** | JWT (JSON Web Token) |
| **Deployment** | Netlify (Frontend), Render (Backend) |
| **Version Control** | Git & GitHub |

---

## 📦 Modules (12 Total)

### 1. 🧭 Coordinator Module
Manages overall project coordination and task assignments.
- Assign and track tasks across teams
- Monitor daily progress reports
- View real-time project status
- Coordinate between Driver, Dispatch, and Planning teams

---

### 2. 🚗 Driver Module
Handles all driver-related operations and tracking.
- Driver registration and profile management
- Trip assignment and route tracking
- Driver performance monitoring
- Attendance and availability management

---

### 3. 📦 Dispatch Module
Core dispatch operations for delivery and logistics.
- Create and manage dispatch orders
- Assign vehicles and drivers to orders
- Real-time dispatch status tracking
- Scheduling and route optimization
- Factor in location, vehicle capacity, and traffic

---

### 4. 🛒 Purchase Module
Manages procurement and vendor operations.
- Purchase order creation and approval
- Vendor/supplier management
- Goods receipt and inspection
- Purchase history and reporting
- Budget tracking for purchases

---

### 5. 🏭 Production Module
Tracks production activities and workflows.
- Production planning and scheduling
- Work order management
- Raw material tracking
- Production progress monitoring
- Output quality reporting

---

### 6. 💰 Accounts / Finance Module
Handles all financial transactions and reporting.
- Income and expense tracking
- Invoice generation and management
- Payment tracking (received & pending)
- Financial reports and balance sheets
- Integration with Cash Tracker module

---

### 7. 💵 Cash Tracker Module
Real-time cash flow tracking across projects.
- Project-wise cash management
- Add income and expense transactions
- Cash transfers between projects 
- Audit log for all transactions
- Master summary across all projects
- Cross-project tracker view

---

### 8. 📋 Planning Module
Project planning with task and dependency management.
- Create and manage project plans
- Task creation with deadlines
- Dependency mapping between tasks
- Gantt-chart style planning (upcoming)
- Planning dashboard overview

---

### 9. 📊 Project Records Module
Maintains records and history of all projects.
- Project creation and tracking
- Milestone and deadline management
- Document and report storage
- Project log history
- Status reports for each project

---

### 10. 📝 Daily Progress Report (DPR) Module
Daily reporting system for on-site teams.
- Submit daily work progress entries
- Photo and document upload support
- Manager review and approval workflow
- Historical DPR search and filter
- Export DPR reports

---

### 11. 👤 User & Role Management Module
Controls access and permissions across the system.
- User registration and login (JWT Auth)
- Role-based access control (Admin, Manager, Driver, Coordinator, etc.)
- Assign modules per role
- Audit trail for user actions
- Password management

---

### 12. 🖥️ Admin Dashboard Module
Central control panel for administrators.
- System-wide analytics and KPIs
- Module activity overview
- User activity monitoring
- Alerts and notifications
- Configuration and settings management

---

## 📁 Project Structure

```
ERP-Dispatch-Fleet-Management-System/
│
├── frontend/                          ← React.js Frontend
│   ├── public/
│   └── src/
│       ├── Module/
│       │   ├── CashTracker/
│       │   │   ├── Components/
│       │   │   ├── Pages/
│       │   │   └── Services/
│       │   ├── Coordinator/
│       │   ├── Driver/
│       │   ├── Dispatch/
│       │   └── Planning/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
└── onedeoleela/                       ← Spring Boot Backend
    └── src/main/java/onedeoleela/
        ├── Controller/
        │   ├── Planning_Controller/
        │   └── (other controllers)
        ├── Service/
        │   ├── Planning_Service/
        │   └── (other services)
        ├── Repository/
        │   ├── Planning_Repository/
        │   └── (other repositories)
        ├── Entity/
        │   ├── Planing_Entity/
        │   └── (other entities)
        ├── CashTracker/
        │   ├── Controller/
        │   ├── Entity/
        │   ├── Repository/
        │   ├── Service/
        │   └── Dto/
        └── Config/
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Alishainamdar17/Dispatch_system.git

# 2. Navigate to backend folder
cd onedeoleela

# 3. Configure database in application.properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/erp_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# 4. Run the Spring Boot application
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

---

### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
REACT_APP_BACKEND_URL=http://localhost:8080

# 4. Start the React app
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔑 Environment Variables

### Frontend `.env`
```
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

### Backend `application.properties`
```
spring.datasource.url=jdbc:mysql://localhost:3306/erp_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

---

## 📡 API Overview

| Module | Base Endpoint |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Dispatch | `/api/dispatch` |
| Driver | `/api/driver` |
| Projects | `/api/projects` |
| Cash Tracker | `/api/cash` |
| Planning | `/api/planning` |
| DPR | `/api/dpr` |
| Purchase | `/api/purchase` |
| Accounts | `/api/accounts` |

---

## 🗺️ Roadmap

- [x] Coordinator Module
- [x] Cash Tracker Module
- [x] Planning Module (Tasks + Dependencies)
- [x] Daily Progress Report Module
- [x] Project Records Module
- [x] User & Role Management
- [ ] Driver Module 
- [ ] Dispatch Module 
- [ ] Purchase Module 
- [ ] Production Module
- [ ] Accounts Module 
- [ ] Admin Dashboard 
---

## 👥 Team

| Name | Role |
|---|---|
| Alisha Inamdar | Backend Developer (Spring Boot) |
| Siddharth Kamble | Full Stack Developer |
| *(Add teammates)* | *(Add roles)* |

---

## 📄 License

This project is for internal/educational use. All rights reserved © 2025.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/ModuleName`
3. Commit your changes: `git commit -m "Add ModuleName feature"`
4. Push to the branch: `git push origin feature/ModuleName`
5. Open a Pull Request

---
ONE DEO LEELA FACADE SYSTEMS PVT. LTD.
Pune, Maharashtra, India

SOFTWARE HANDOVER DOCUMENT
Enterprise Resource Planning (ERP) System
Full-Stack Web Application

Document No.	ODL-ERP-HANDOVER-2026-001
Version	1.0 (Final)
Date	June 12, 2026
Prepared By	Siddharth Kamble, Jr. Software Developer
Organization	One Deo Leela Facade Systems Pvt. Ltd.
Standard	IEEE STD 1063-2001 (Software User Documentation)
Classification	CONFIDENTIAL — Internal Use Only
 
1. INTRODUCTION

1.1 Purpose
This document serves as the official Software Handover Document for the Enterprise Resource Planning (ERP) system developed for One Deo Leela Facade Systems Pvt. Ltd. It is prepared in accordance with IEEE STD 1063-2001 (Standard for Software User Documentation) to provide a comprehensive technical and functional reference for the incoming development team. The intent is to ensure zero knowledge gap during the handover process so that the team can confidently maintain, enhance, and operate the system immediately after the transition.

1.2 Scope
This handover document covers the following:
•	The full-stack ERP web application built using Spring Boot (backend) and React.js (frontend)
•	All 12 functional modules spanning Coordinator, Dispatch, Driver, Planning, Production, Requisition, and Boss/PA roles
•	Database schema design using PostgreSQL managed via JPA/Hibernate
•	Security and CORS configuration
•	Deployment architecture on AWS EC2
•	Environment setup and local development instructions
•	Known issues, limitations, and pending development items

1.3 Intended Audience
This document is intended for:
•	Incoming backend and frontend developers who will maintain and extend the system
•	Team leads and project managers overseeing the ERP system
•	DevOps engineers responsible for deployment and infrastructure
•	QA engineers who will test the system

1.4 Document Organization
This document is structured as follows:
•	Section 1 — Introduction and purpose
•	Section 2 — System overview and architecture
•	Section 3 — Technology stack and dependencies
•	Section 4 — Project structure (Backend)
•	Section 5 — Project structure (Frontend)
•	Section 6 — Database design and entity relationships
•	Section 7 — Module-wise functional documentation
•	Section 8 — API reference
•	Section 9 — Security and CORS configuration
•	Section 10 — Environment configuration
•	Section 11 — Build, deployment, and infrastructure
•	Section 12 — Known issues and technical debt
•	Section 13 — Glossary
•	Section 14 — Document revision history
 
2. SYSTEM OVERVIEW

2.1 Business Context
One Deo Leela Facade Systems Pvt. Ltd. is a construction and interior facade company based in Pune, India, specializing in facade work involving windows, aluminium frames, glass shutters, and related installation activities across large-scale residential projects. The company manages operations across multiple sites (projects), towers, floors, and individual flat units.
Before this ERP system was developed, operational data was managed through spreadsheets, manual paperwork, and disconnected tools. This ERP system was built to digitize and centralize operations including vehicle dispatch, driver tracking, work order management, coordinator tracking sheets, planning schedules, expense management, and daily progress reporting.

2.2 System Description
The ERP is a multi-role, browser-based web application. Different employees log in with their Employee Code (eCode) and password and are redirected to role-specific dashboards. The system is currently live on 192.138.1.67 Server PC.

2.3 User Roles
Role	Description	Key Capabilities
ADMIN	System Administrator	User management, full access to all modules
COORDINATOR	Site Coordinator	Work Orders, Info Sheets, Tracker Sheets, Tracker Summary, Project/Tower/Floor/Flat management, Planning
DISPATCH	Dispatch Manager	Vehicle management, Route planning, Trip assignment, Expense tracking, Daily Progress Reports, Window DC, Material DC
DRIVER	Vehicle Driver	View assigned trips, submit expenses, upload vehicle images, cancel trips
VP	Vice President	Dashboard visibility across modules
BOSS	Company Head	Appointment view with notification widget
PA	Personal Assistant	Appointment management for BOSS
PLANNING	Planning Department	Work template management and project schedule PDF generation
PRODUCTION	Production Team	View uploaded production plans
PURCHASE	Purchase Department	Dashboard access
SITE_SUPERVISOR	Site Supervisor	Dashboard access
POWDER_COATING	Powder Coating Department	Dashboard access

2.4 High-Level Architecture
The system follows a standard three-tier architecture:
•	Presentation Layer: React.js SPA running in browser, communicating via REST API calls over HTTP
•	Application Layer: Spring Boot REST API server, handling business logic, authentication, and data processing
•	Data Layer: PostgreSQL relational database managed via JPA/Hibernate with auto DDL
The frontend and backend are deployed separately on an 192.168.1.67 Server PC. The frontend communicates with the backend via CORS-enabled REST endpoints under the /api/** path prefix. Authentication is session-based using plain eCode and password comparison (no JWT). User session data is stored in browser localStorage.
 
3. TECHNOLOGY STACK AND DEPENDENCIES

3.1 Backend Technologies
Technology	Version / Detail	Purpose
Java (JDK)	JDK 17 (LTS)	Primary programming language for backend
Spring Boot	Latest stable (3.x)	Application framework — REST API, dependency injection, JPA integration
Spring Security	Included with Spring Boot	CORS configuration, HTTP security filter chain, endpoint protection
Spring Data JPA	Included with Spring Boot	ORM layer — entity management, repository pattern, query generation
Hibernate	Bundled with Spring Data JPA	JPA provider; DDL-auto=update auto-creates and migrates DB tables
PostgreSQL	Latest stable	Primary relational database
PostgreSQL JDBC Driver	org.postgresql.Driver	JDBC connectivity between Spring Boot and PostgreSQL
Lombok	Latest stable	@Getter, @Setter, @Data, @Builder, @AllArgsConstructor, @NoArgsConstructor — removes boilerplate
Apache PDFBox	Latest stable	PDF generation for Planning Report (A4 Landscape, multi-page, wrapped text)
Maven	Build tool (pom.xml)	Dependency management and build lifecycle
Jackson (FasterXML)	Included with Spring Boot	JSON serialization/deserialization; @JsonIgnore, @JsonProperty used throughout

3.2 Frontend Technologies
Technology	Version / Detail	Purpose
React.js	JavaScript (CRA)	Frontend UI library — component-based SPA
React Router DOM	v6	Client-side routing with nested routes for role-specific dashboards
JavaScript (ES6+)	Vanilla JS	Business logic, API calls, state management in components
CSS / Inline Styles	Custom CSS	Component-level styling; App.css and index.css for global styles
localStorage	Browser API	Stores logged-in user object (id, eCode, role, fullName) post login
Fetch API / Axios	Browser native	HTTP requests to Spring Boot backend REST endpoints
PDF generation (frontend)	Custom JS	Certain modules generate PDF client-side from table data
Recharts / Chart.js	npm packages	Expense charts and analytics in Dispatch module

3.3 Infrastructure
Component	Technology	Detail
Cloud Platform	AWS EC2	Application hosted on EC2 instance; both frontend and backend deployed here
Database	PostgreSQL on EC2	Runs on the same or separate EC2 instance
Environment Config	Environment Variables	DATASOURCE_URL, DATASOURCE_USER, DATASOURCE_PASSWORD, FRONTEND_URL injected at runtime
Build	Maven (backend), npm (frontend)	Backend: mvn package; Frontend: npm run build
CI/CD	GitHub Actions	Automated build and deployment pipeline
Version Control	GitHub	Source code repository
 
4. BACKEND PROJECT STRUCTURE

4.1 Root Package
The entire backend application is housed under the root Java package:
onedeoleela.onedeoleela
The main application entry point is:
onedeoleela.onedeoleela.OnedeoleelaApplication.java

4.2 Directory Tree
The backend src/main/java/ directory is organized as follows:
src/main/java/onedeoleela/onedeoleela/
├── Config/                      # Spring configuration classes
│   ├── CorsConfig.java          # CORS filter configuration
│   ├── DataInitializer.java     # Seeds default ADMIN user on startup
│   └── SecurityConfig.java      # Spring Security filter chain
├── Controller/                  # REST controllers for core modules
│   ├── AuthController.java      # /api/auth/login, /api/auth/logout
│   ├── AdminUserController.java # User management endpoints
│   ├── DailyProgressReportController.java
│   ├── DriverController.java
│   ├── DriverBreakActivityController.java
│   ├── ExpenseController.java
│   ├── ExpenseEntityController.java
│   ├── FileController.java      # File upload/download
│   ├── FlatController.java
│   ├── FloorController.java
│   ├── HealthController.java    # /health endpoint
│   ├── ItemController.java      # DC items from Excel upload
│   ├── LiveTrackingController.java
│   ├── LookupController.java
│   ├── PlanningController.java
│   ├── PlanningReportController.java # PDF report generation
│   ├── PortalTripController.java
│   ├── ProjectController.java
│   ├── ProjectLogController.java
│   ├── ProjectRecordsController.java
│   ├── TowerController.java
│   ├── TripController.java
│   ├── TripCancellationController.java
│   ├── TripStatusUpdateController.java
│   ├── UserController.java
│   ├── VehicleController.java
│   ├── VehicleActivityController.java
│   ├── VehicleActivityImageController.java
│   ├── VehicleActivityTrackController.java
│   ├── VehicleFuelDataController.java
│   ├── VehicleRequestController.java
│   ├── VehicleRequisitionController.java
│   ├── VehicleRequisitionGroupController.java
│   ├── WindowController.java
│   └── PA_BOSS/
│       └── AppointmentController.java
├── Coordinator/                 # Coordinator sub-module (own MVC stack)
│   ├── Controller/              # InfoSheet, TrackerSheet, WorkOrder, TrackerSummary
│   ├── DTO/                     # Data Transfer Objects for Coordinator APIs
│   ├── Entity/                  # WorkOrder, WorkOrderItem, InfoSheet, InfoSheetFlat,
│   │                            # InfoSheetItem, TrackerSheet, TrackerSheetRow
│   ├── Repository/
│   ├── Service/
│   └── Util/
│       └── SqftConverter.java   # Converts mm dimensions and sqm/sqft units
├── Dto/                         # Shared DTOs (Planning requests, RouteGroupDTO)
├── Entity/                      # Core domain entities
├── Planning/                    # Planning sub-module
│   ├── Controller/
│   ├── Entity/
│   ├── Repository/
│   └── Service/
├── Repository/                  # Spring Data JPA repositories for core entities
├── Service/                     # Business logic services for core entities
├── Util/                        # Utility classes (ExpensePdfGenerator)
└── resources/
    └── application.yaml         # App config (DB, JPA, multipart, frontend URL)

4.3 Key Configuration Files
4.3.1 application.yaml
Located at: src/main/resources/application.yaml
All sensitive values are injected via environment variables at runtime. No hard-coded credentials exist in code.
Config Key	Environment Variable	Description
spring.datasource.url	DATASOURCE_URL	PostgreSQL JDBC connection URL
spring.datasource.username	DATASOURCE_USER	Database username - postgres
spring.datasource.password	DATASOURCE_PASSWORD	Database password - 1535
spring.jpa.hibernate.ddl-auto	N/A (set to 'update')	Auto-creates/alters tables based on entity changes — IMPORTANT: do not change to 'create' in production
spring.jpa.show-sql	N/A (set to true)	Logs all SQL queries — useful for debugging, disable in production for performance
spring.servlet.multipart.max-file-size	N/A (50MB)	Maximum size per uploaded file (used for Excel, image uploads)
frontend.url	FRONTEND_URL	Used in CorsConfig to whitelist the production frontend URL




4.3.2 DataInitializer.java — Default Admin Seeding
On every application startup, DataInitializer checks if a user with eCode 1001 exists. If not, it creates the default system admin:
Field	Value
Employee Code (eCode)	1001
Full Name	System Admin
Email	admin@company.com
Password	admin@123 (PLAIN TEXT — see Security section)
Role	ADMIN
IMPORTANT: Passwords are stored and compared as plain text. This is a known security gap. See Section 12 (Known Issues) for details.
 
5. FRONTEND PROJECT STRUCTURE

5.1 Technology and Entry Points
The frontend is a Create React App (CRA) project. The entry point is src/index.js which renders the root <App /> component. All client-side routing is managed in src/App.js using React Router DOM v6.

5.2 Directory Structure
src/
├── App.js                        # Root component with all route definitions
├── App.css                       # Global styles
├── index.js                      # ReactDOM.render entry point
├── index.css                     # Base CSS reset
├── index.html                    # HTML shell
├── Layout/
│   └── DashboardLayout.js        # Shared layout wrapper (sidebar + content area)
├── components/
│   ├── Sidebar.js                # Navigation sidebar component
│   ├── NewProjectModal.js        # Modal for creating new projects
│   └── TripGanttChart.js         # Gantt chart component for trip visualization
├── Module/
│   ├── Boss/
│   │   └── NotificationWidget.js # BOSS role appointment notification widget
│   ├── Common/
│   │   └── Uservehiclerequestpage.js # Shared vehicle request page
│   ├── Coordinator/
│   │   └── Pages/
│   │       ├── ProjectManagerPage.js   # Project CRUD management
│   │       ├── FloorFlatManager.js     # Tower > Floor > Flat hierarchy management
│   │       ├── WorkOrdersPage.js       # Work Order list view
│   │       ├── WorkOrderFormPage.js    # Create / Edit Work Order form (unified)
│   │       ├── InfoSheetListPage.js    # Info Sheets list per Work Order
│   │       ├── InfoSheetFormPage.js    # Create / Edit Info Sheet form
│   │       ├── TrackerPage.js          # Tracker Sheet list
│   │       ├── TrackerFormPage.js      # Production Tracker Sheet form (large, complex)
│   │       ├── TrackerSummaryPage.js   # Aggregated summary view of tracker
│   │       └── WorkOrderListPage.js    # Alternative WO listing
│   ├── Dispatch/
│   │   ├── Components/
│   │   │   ├── Analytics/expenseChart.js
│   │   │   ├── Expense/               # ExpenseForm, ExpenseTable, expenseSummary
│   │   │   ├── SideBar/VehicleSidebar.js
│   │   │   └── Vehicle/               # VehicleCard, VehicleForm, VehicleTable
│   │   ├── Pages/                     # 20+ pages — full list in Section 7
│   │   └── Services/                  # driverService, vehicleService, expenseService, etc.
│   ├── Driver/
│   │   ├── pages/                     # CancelledTrip, CompletedTrips, DriverExpensePage, VehicleImageUploader
│   │   └── Services/breakService.js
│   ├── Planning/
│   │   └── WorkTemplatePage.js        # Work template CRUD with line items
│   ├── Production/
│   │   └── Pages/ViewUploadPlans.js
│   └── Requisition/
│       ├── Components/RequisitionTable.js
│       └── Pages/AddVehicleRequisition.js, VehicleRequisitionList.js

5.3 Routing and Role-Based Navigation
All routes are defined in App.js. Login happens at the root path (/). After successful login, the backend returns the User object (id, eCode, fullName, role) which is stored in localStorage under the key 'user'. The app reads this to redirect to the correct dashboard.

Role	Root Dashboard Route	Nested Child Routes
ADMIN	/admin-dashboard	—
PLANNING	/planning-dashboard	—
VP	/vp-dashboard	—
DRIVER	/driver-dashboard	—
BOSS	/boss-appointments	—
PA	/pa-appointments	—
DISPATCH	/dispatch-dashboard	vehicles, active-vehicles, inactive-vehicles, routes, routes/add, routes/history/:tripId, vehicle-portal, drivers, vehicle-status-images, live-tracking, expenses, material-dc, daily-reports, vehicle-monitoring, window-dc, bulk-upload-window, dispatch-report, vehicle-requests
PRODUCTION	/production-dashboard	—
PURCHASE	/purchase-dashboard	—
SITE_SUPERVISOR	/site_supervisor-dashboard	—
POWDER_COATING	/powder_coating-dashboard	—
COORDINATOR	/coordinator-dashboard	projects, floor-flat, planning/create, planning/view, vehicle-requests, work-orders, work-orders/create, work-orders/:id/edit, tracker, tracker/:workOrderId/sheets/create, tracker/:workOrderId/sheets/:id/edit, production-tracker, tracker-summary

5.4 State Management
The application does not use Redux or any global state management library. State is managed locally within each React component using useState and useEffect hooks. Cross-component data sharing is handled through:
•	URL parameters (React Router useParams) — e.g., workOrderId in tracker routes
•	localStorage — for user session data
•	Props drilling in a few parent-child component relationships
 
6. DATABASE DESIGN AND ENTITY RELATIONSHIPS

6.1 Database Platform
PostgreSQL is used as the primary database. Hibernate with ddl-auto=update manages schema creation and migration. All table and column names use snake_case (e.g., work_orders, tracker_sheet_rows). The application uses the default PostgreSQL public schema.

6.2 Core Domain Entities
6.2.1 User Management
Entity	Table	Key Fields	Notes
User	users	id (PK), e_code (UNIQUE), full_name (UNIQUE, NOT NULL), email, password, role (ENUM)	Role stored as STRING enum. Plain text password. Admin seeded on startup with eCode=1001

6.2.2 Project Hierarchy
The project domain follows a strict hierarchy: Project → Tower → Floor → Flat → Window
Entity	Table	Key Fields	Relationships
Project	projects	projectId, projectCode, projectName, projectType, clientName, siteName, city, state, startDate, expectedEndDate, projectStatus, totalAreaSqFt, numberOfFloors	OneToMany → Tower
Tower	tower	towerId, towerName, totalFloors, project_id (FK)	ManyToOne → Project; OneToMany → Floor
Floor	floor	floorId, floorNumber, totalFlats, tower_id (FK)	ManyToOne → Tower; OneToMany → Flat
Flat	flat	flatId, flatNumber, floor_id (FK)	ManyToOne → Floor; used as FK in Window
Window	windows	windowId, windowSeriesNumber, wCodeNo, location, jobCardNo, series, width, height, trackOuter, bottomFix, glassShutter, meshShutter, units, sqft, remark, flat_id (FK), floor_id (FK), trip_id (FK)	ManyToOne → Flat, Floor, Trip
Item	items	id, srNo, winSrNo, flat_id (FK), floor_id (FK), location, wcode, jobCardNo, priority, description, width, height, qty, unit, sqft, weight, rMtr, remarks, tripId	Represents one row from an Excel DC upload. 17 columns mapped from Excel template

6.2.3 Coordinator Module Tables
Entity	Table	Key Fields	Notes
WorkOrder	work_orders	id, workOrderNo (UNIQUE), projectName, towerName, date	Root of Coordinator workflow. OneToMany → WorkOrderItem
WorkOrderItem	work_order_items	id, work_order_id (FK), itemDescription, quantity, unit, rate, etc.	Child line items of a Work Order
InfoSheet	info_sheets	id, work_order_id (FK), projectName, towerName, date	OneToMany → InfoSheetFlat
InfoSheetFlat	info_sheet_flats	id, info_sheet_id (FK), flatType, flatNo	Groups items per flat. OneToMany → InfoSheetItem
InfoSheetItem	info_sheet_items	id, info_sheet_flat_id (FK), itemDetails, dimensions, quantities	Individual items within a flat
TrackerSheet	tracker_sheets	id, work_order_id (FK), sheetName, createdDate	OneToMany → TrackerSheetRow
TrackerSheetRow	tracker_sheet_rows	id, tracker_sheet_id (FK), srNo, flat, location, wcode, typology, series, woLnt, woHgt, sqft, length, height, jobCard, supplyFrame, supplyDoorFrame, supplyShutter, supplyOpenableDoor, supplyFixGlass, supplyTopBottomFix, installFrame, installDoorFrame, installShutter, installOpenableDoor, installFixGlass, installTopBottomFix, hwFrame, hwDoorFrame, hwShutter, hwOpenableDoor, hwFixGlass, hwTopBottomFix, handoverStatus, dcNo	Very large entity — 30+ columns representing the production tracker grid with Supply, Installation, Hardware sub-columns

6.2.4 Transport / Dispatch Tables
Entity	Table	Key Fields	Notes
Vehicle	vehicles	id, type, vehicleNumber, eCode, driver_id (FK)	ManyToOne → Driver
Driver	drivers	id, name, mobile, licenseNo, eCode, joiningDate	Stand-alone entity linked to Vehicle
Trip	trips	id, vehicleId, driverId, vehicleNumber, driverName, driverECode, status (ENUM), description, points (ElementCollection → trip_points), tripDate	TripStatusEnum: ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
TripStatusUpdate	trip_status_update	id, trip_id (FK), status, updatedAt, notes	Audit trail of status changes
TripCancellation	trip_cancellations	id, tripId, reason, cancelledAt, cancelledBy	Cancellation record
CancelledTrip	cancelled_trips	id, tripId, reason, cancelledAt	Secondary cancelled trip record
VehicleActivity	vehicle_activities	id, vehicleId, activityType, startTime, endTime, notes	Records each vehicle activity session
VehicleActivityImage	vehicle_activity_images	id, vehicleActivityId, imageData (BLOB), fileName, contentType, compressedSize	Images uploaded by drivers
VehicleActivityTrack	vehicle_activity_tracks	id, vehicleId, latitude, longitude, timestamp	GPS tracking data
VehicleFuelData	vehicle_fuel_data	id, vehicleId, liters, cost, fuelDate, odometer	Fuel logs
VehicleRequest	vehicle_requests	id, requestedBy, vehicleId, driverId, fromLocation, toLocation, requestDate, status	Employee vehicle request workflow
VehicleRequisition	vehicle_requisitions	id, requesterId, vehicleId, purpose, startDate, endDate, status	Vehicle requisition management
LiveTracking	live_tracking	id, vehicleId, driverId, lat, lng, speed, heading, timestamp, tripId	Real-time GPS location
PortalTrip	portal_trips	id, vehicleNo, driverName, origin, destination, startTime, endTime, status	Vehicle portal trip records
Expense	expenses	id, vehicleId, expenseType, amount, date, description	Linked to Vehicle
ExpenseEntity	expense_entities	id, vehicleId, driverId, expenseType, amount, receiptImage, date, notes	Detailed expense with image
DailyProgressReport	daily_progress_report	id, reportDate, employeeName, specialNote, srNo, vehicleNumber, tripNumber, driverName, and many more dispatch detail columns	Very large entity — captures the full daily dispatch report row-by-row

6.2.5 Planning Module Tables
Entity	Table	Key Fields	Notes
PlanningProject	planning_projects	id, projectName, createdDate	Top-level planning project
PlanningWork	planning_works	id, planningProjectId (FK), workName, startDate, endDate	A work item under a planning project
PlanningLineItem	planning_line_items	id, planningWorkId (FK), lineItem, startDate, endDate, days, department, actionPerson, status, reason, delayInDays, remark	Detailed line item for the planning schedule PDF
PlanningHistory	planning_histories	id, lineItemId, changedAt, changedBy, field, oldValue, newValue	Audit trail for planning changes
WorkTemplate	work_templates	id, templateName, createdDate	Reusable work templates
TemplateLineItem	template_line_items	id, workTemplateId (FK), lineItemName, estimatedDays, department	Line items within a template

6.2.6 Other Tables
Entity	Table	Notes
ProjectLog	project_logs	Audit log entries for project changes
ProjectRecords	project_records	Tracks project record data with file references
FileEntity	files	Stores file metadata (fileName, contentType, data as byte array) for production plan uploads
Appointment (PA_BOSS)	appointments	Appointment records linking BOSS and PA roles with time, description, location
VehicleReplacementLog	vehicle_replacement_logs	Logs vehicle driver/assignment replacements
Material	materials	Material catalogue items
 
7. MODULE-WISE FUNCTIONAL DOCUMENTATION

7.1 Authentication Module
7.1.1 Login Flow
Authentication is plain credential-based. No JWT or session tokens are used.
•	User enters Employee Code (eCode) and password on the login page (/)
•	Frontend calls POST /api/auth/login with JSON body: { eCode: number, password: string }
•	Backend AuthService looks up the user by eCode, compares password as plain string
•	If valid, the full User object is returned (including role). Frontend stores it in localStorage as 'user'
•	If invalid, HTTP 401 is returned with error message
•	Frontend reads the role field and navigates to the corresponding dashboard route

7.1.2 BOSS Session File
IMPORTANT DESIGN NOTE: When a user with role=BOSS logs in, the AuthController writes a file named boss_session.txt to the server's home directory (System.getProperty('user.home')/boss_session.txt). This file was designed to signal an Electron-based desktop widget to show BOSS notifications. When BOSS logs out, or any non-BOSS user logs in, this file is deleted. This is a server-side file system side effect and must be maintained if the Electron widget is in use.

7.1.3 Logout
Frontend calls POST /api/auth/logout with the User object. Backend deletes boss_session.txt if the role is BOSS. Frontend clears localStorage and redirects to /.

7.2 Coordinator Module
This is the most complex and recently developed module. It manages the full workflow from Work Order creation through Info Sheets to Production Tracker Sheets and Summary.

7.2.1 Work Order Management
Work Orders (WOs) are the root entity of the Coordinator workflow. A WO represents a formal order for facade work on a specific project and tower.
•	Backend Controller: Coordinator/Controller/WorkOrderController.java
•	Backend Service: Coordinator/Service/WorkOrderService.java
•	Entity: Coordinator/Entity/WorkOrder.java (fields: id, workOrderNo, projectName, towerName, date)
•	Child Entity: WorkOrderItem — stores individual items/quantities under the WO
•	Frontend: WorkOrdersPage.js (list), WorkOrderFormPage.js (create/edit unified)
•	Route: /coordinator-dashboard/work-orders, /coordinator-dashboard/work-orders/create, /coordinator-dashboard/work-orders/:id/edit

7.2.2 Info Sheet Management
Info Sheets capture measurement data per flat for a given Work Order. Each Info Sheet can contain multiple flats, and each flat has multiple items.
•	The hierarchy is: WorkOrder → InfoSheet → InfoSheetFlat → InfoSheetItem
•	Backend Controller: Coordinator/Controller/InfoSheetController.java
•	Backend Service: Coordinator/Service/InfoSheetService.java
•	Export Service: Coordinator/Service/InfoSheetExportService.java — generates export of info sheet data
•	Export Controller: Coordinator/Controller/InfoSheetExportController.java
•	Frontend: InfoSheetListPage.js (list view), InfoSheetFormPage.js (large create/edit form — 114KB)
•	Route: /coordinator-dashboard/tracker, /coordinator-dashboard/tracker/:workOrderId/sheets/create, /coordinator-dashboard/tracker/:workOrderId/sheets/:id/edit

7.2.3 Tracker Sheet (Production Tracker)
The Tracker Sheet is a complex grid-based production tracking form. It tracks Supply, Installation, and Hardware progress per window item.
•	Entity: TrackerSheetRow — 30+ columns covering WO dimensions, actual dimensions, Supply sub-columns (Frame, Door Frame, Shutter, Openable Door, Fix Glass, Top/Bottom Fix), Installation sub-columns (same 6), Hardware sub-columns (same 6), Handover Status, DC No
•	Backend Controller: Coordinator/Controller/TrackerSheetController.java
•	Backend Service: Coordinator/Service/TrackerSheetService.java — largest service (44KB)
•	Frontend: TrackerFormPage.js — largest frontend file (287KB, extremely complex multi-column grid)
•	Route: /coordinator-dashboard/production-tracker

7.2.4 Tracker Summary
Provides an aggregated summary view of tracker data across work orders.
•	Backend Controller: Coordinator/Controller/TrackerSummaryController.java
•	Backend Service: Coordinator/Service/TrackerSummaryService.java
•	DTO: Coordinator/DTO/TrackerSummaryDTO.java
•	Frontend: TrackerSummaryPage.js (98KB)
•	Route: /coordinator-dashboard/tracker-summary

7.2.5 SqftConverter Utility
Coordinator/Util/SqftConverter.java is a pure utility class with three static methods:
•	convertMm(lengthMm, heightMm): Converts millimeter dimensions to square feet. Formula: (L * H) / 1,000,000 * 10.764, precision 4 decimal places
•	convertWoQty(rawValue, woQtyUnit): Converts WO quantity from sqm to sqft if unit is 'sqm', otherwise passes through as sqft
•	calcWoQtyNos(woQtySqft, sqft): Divides total sqft by per-unit sqft to get number of units (floor division)

7.3 Dispatch Module
The Dispatch module is the largest module by file count and handles all vehicle operations, trip management, driver tracking, expense management, and daily reporting.

7.3.1 Vehicle Management
•	CRUD for Vehicle entity (type, vehicleNumber, eCode, driver assignment)
•	Active / Inactive vehicle pages with status toggling
•	Backend: VehicleController.java, VehicleService.java
•	Frontend: VehicleCard.js, VehicleForm.js, VehicleTable.js, ActiveVehiclePage.js, InActiveVehiclePage.js


7.3.2 Trip Management
•	Create trips by assigning a vehicle and driver, specifying route points and description
•	Trip lifecycle: ASSIGNED → IN_PROGRESS → COMPLETED or CANCELLED
•	TripStatusEnum values: ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
•	Route points are stored as a list of strings (ElementCollection in trip_points table)
•	Backend: TripController.java, TripService.java, TripStatusUpdateController.java, TripCancellationController.java
•	Frontend: AddRoute.js, ViewRoutes.js, OngoingTripManager.js, TripHistoryPage.js, CancellationInfo.js, DriverGanttChart.js, TripGanttChart.js

7.3.3 Live Tracking
•	Stores GPS coordinates (latitude, longitude) for vehicles in real-time
•	Frontend: LiveTrackingPage.js (43KB), MapView.js — renders map with vehicle positions
•	Backend: LiveTrackingController.java, LiveTrackingService.java, LiveTrackingRepository.java
•	Entity: LiveTracking with lat, lng, speed, heading, timestamp, vehicleId, driverId, tripId

7.3.4 Window DC and Bulk Upload
•	WindowManagerPage.js — manages Window Delivery Challan (DC) records
•	BulkUploadWindowPage.js — allows bulk upload of window data from Excel file
•	Backend: WindowController.java, WindowService.java (19KB) — complex window management logic
•	ItemDCPage.js — manages Item DC records; BulkUploadWindowPage.js handles Excel parsing for Items
•	Excel upload maps 17 columns (Sr No, Win Sr No, Floor No, Flat No, Location, Window Code, Job Card No, Priority, Description, Width, Height, Qty, Unit, SqFt, Weight, R Mtr, Remarks) to the Item entity

7.3.5 Expense Management
•	Tracks vehicle expenses (fuel, maintenance, tolls, etc.)
•	Two expense entities: Expense (simple) and ExpenseEntity (detailed with receipt image)
•	ExpensePdfGenerator.java in Util/ generates expense PDF reports
•	Frontend: VehicleExpensesPage.js (68KB), ExpenseForm.js, ExpenseTable.js, expenseChart.js

7.3.6 Daily Progress Report
•	DailyProgressReport entity captures the full daily dispatch report in row-based structure
•	Each row represents one trip of one vehicle on a given date
•	Columns include: reportDate, employeeName, specialNote, srNo, vehicleNumber, tripNumber, driverName, and extensive dispatch detail fields
•	Backend: DailyProgressReportController.java, DailyProgressReportService.java (35KB)
•	Frontend: DailyReports.js (52KB) — complex form with row management
•	DispatchReport.js (20KB) — report viewing and export

7.3.7 Vehicle Requests
•	Employees can request vehicles through VehicleRequestController
•	Dispatch managers see requests in DispatchRequestPage.js and can approve/reject
•	Common page Uservehiclerequestpage.js allows any role to make vehicle requests


7.4 Driver Module
•	Drivers access a dedicated dashboard (/driver-dashboard)
•	CompletedTrips.js — drivers view their completed trip history
•	CancelledTrip.js — drivers can request trip cancellation
•	DriverExpensePage.js — drivers submit expense claims
•	VehicleImageUploader.js — drivers upload vehicle condition photos
•	breakService.js — manages driver break activity (DriverBreakActivity entity)
•	Backend: DriverController.java, DriverBreakActivityController.java, VehicleActivityImageController.java

7.5 Planning Module
•	WorkTemplatePage.js — create and manage reusable work templates with line items
•	WorkTemplateController.java + WorkTemplateService.java (15KB) — backend for templates
•	PlanningController.java — manages PlanningProject, PlanningWork, PlanningLineItem entities
•	PlanningReportController.java — generates Project Schedule PDF on demand
•	PlanningReportService.java — generates A4 Landscape PDF using Apache PDFBox with 11 columns, dynamic row height for wrapped REASON text, multi-page support, separator lines between rows
•	PlanningHistoryService.java — tracks all changes to planning line items

7.6 Boss / PA Module
•	AppointmentController.java (PA_BOSS/) — manages appointments between BOSS and PA
•	Appointment entity: appointmentId, appointmentDate, time, description, location, status, createdBy, attendees
•	BossAppointmentPage (frontend) — BOSS views appointments
•	PAAppointmentPage (frontend) — PA manages/creates appointments
•	NotificationWidget.js (79KB) — BOSS-role widget that displays appointment notifications. Renders only when user role is BOSS

7.7 Project Records Module
•	ProjectRecords entity tracks project-related file records
•	ProjectRecordsController.java + ProjectRecordsService.java (10KB)
•	FileController.java + FileService.java — handles production plan file uploads (PDF, images stored as byte arrays in FileEntity)
•	Production/Pages/ViewUploadPlans.js — view uploaded production plans

7.8 Requisition Module
•	AddVehicleRequisition.js — form to create a vehicle requisition
•	VehicleRequisitionList.js — list and status management of requisitions
•	VehicleRequisitionController.java, VehicleRequisitionService.java
•	VehicleRequisitionGroupController.java — manages grouped requisitions
•	VehicleRequisitionGroupingService.java — handles grouping logic
 
8. API REFERENCE

8.1 Base URL and Conventions
All API endpoints are prefixed with /api/. CORS is enabled for localhost:* (any port) and the production frontend URL (FRONTEND_URL env variable). All endpoints are currently open (no authentication token required) — see Security section.

8.2 Authentication Endpoints
Method	Endpoint	Request Body	Response	Description
POST	/api/auth/login	{ eCode: Long, password: String }	200: User object with role | 401: error string	Authenticates user by eCode and password. Returns full User object. Writes boss_session.txt for BOSS role.
POST	/api/auth/logout	{ role: String, ... }	200: OK	Deletes boss_session.txt if role=BOSS.

8.3 Coordinator Module Endpoints
Method	Endpoint	Description
GET	/api/coordinator/work-orders	Get all work orders
POST	/api/coordinator/work-orders	Create new work order (with items)
GET	/api/coordinator/work-orders/{id}	Get work order by ID
PUT	/api/coordinator/work-orders/{id}	Update work order
DELETE	/api/coordinator/work-orders/{id}	Delete work order
GET	/api/coordinator/info-sheets	Get all info sheets
POST	/api/coordinator/info-sheets	Create info sheet with flats and items
GET	/api/coordinator/info-sheets/{id}	Get info sheet by ID
PUT	/api/coordinator/info-sheets/{id}	Update info sheet
DELETE	/api/coordinator/info-sheets/{id}	Delete info sheet
GET	/api/coordinator/info-sheets/export/{id}	Export info sheet data
GET	/api/coordinator/tracker-sheets	Get all tracker sheets
POST	/api/coordinator/tracker-sheets	Create tracker sheet with rows
GET	/api/coordinator/tracker-sheets/{id}	Get tracker sheet by ID
PUT	/api/coordinator/tracker-sheets/{id}	Update tracker sheet
GET	/api/coordinator/tracker-summary	Get aggregated tracker summary

8.4 Dispatch Module Endpoints
Method	Endpoint	Description
GET/POST/PUT/DELETE	/api/vehicles/**	Vehicle CRUD
GET/POST	/api/trips/**	Trip management
GET/POST/PUT	/api/trips/{id}/status	Update trip status
GET/POST	/api/trip-cancellations/**	Trip cancellation
GET/POST	/api/live-tracking/**	GPS location updates
GET/POST	/api/drivers/**	Driver CRUD
GET/POST	/api/driver-break-activity/**	Driver break management
GET/POST/DELETE	/api/expenses/**	Expense management
GET/POST/DELETE	/api/expense-entities/**	Detailed expense with images
GET/POST	/api/daily-progress-reports/**	Daily progress report CRUD
GET/POST/DELETE	/api/windows/**	Window DC management
GET/POST/DELETE	/api/items/**	Item DC management
POST	/api/items/bulk-upload	Bulk upload items from Excel
GET/POST	/api/vehicle-fuel-data/**	Fuel data management
GET/POST	/api/vehicle-activity/**	Vehicle activity tracking
GET/POST	/api/vehicle-activity-images/**	Driver image uploads
GET/POST/PUT	/api/vehicle-requests/**	Vehicle request workflow
GET/POST	/api/vehicle-requisitions/**	Vehicle requisitions
GET/POST	/api/portal-trips/**	Portal trip records

8.5 Planning Module Endpoints
Method	Endpoint	Description
GET/POST/PUT/DELETE	/api/planning/projects/**	Planning project CRUD
GET/POST/PUT/DELETE	/api/planning/works/**	Planning work CRUD
GET/POST/PUT/DELETE	/api/planning/line-items/**	Line item CRUD
GET	/api/planning/works/{workId}/report	Download Project Schedule PDF (PDFBox generated)
GET/POST/PUT/DELETE	/api/work-templates/**	Work template CRUD

8.6 Other Endpoints
Method	Endpoint	Description
GET/POST/PUT/DELETE	/api/projects/**	Project CRUD
GET/POST/PUT/DELETE	/api/towers/**	Tower CRUD
GET/POST/PUT/DELETE	/api/floors/**	Floor CRUD
GET/POST/PUT/DELETE	/api/flats/**	Flat CRUD
GET/POST	/api/files/**	File upload/download for production plans
GET/POST/PUT/DELETE	/api/appointments/**	Appointment management (BOSS/PA)
GET/POST	/api/users/**	User management (admin)
GET	/api/lookups/**	Lookup/dropdown data
GET	/api/project-logs/**	Project audit logs
GET	/health	Health check endpoint
 
9. SECURITY AND CORS CONFIGURATION

9.1 Spring Security Configuration
SecurityConfig.java configures the Spring Security filter chain with the following rules:
•	CSRF is disabled — the API is stateless and consumed by a browser SPA
•	CORS is enabled via the CorsConfig.java bean
•	HTTP OPTIONS preflight requests are permitted for all paths (/**) — required for browser CORS
•	/api/auth/** endpoints are explicitly permitted
•	/api/** endpoints are all permitted
•	/projects/** endpoints are permitted
•	anyRequest().permitAll() — ALL other requests are also permitted (no authentication enforcement at the framework level)
IMPORTANT SECURITY NOTE: The current configuration has .anyRequest().permitAll() which means ALL API endpoints are publicly accessible without authentication. There is no JWT token validation or session-based authentication enforced by the server. The only access control is client-side (role-based routing in React). This is a known issue and must be addressed before any public-facing deployment.

9.2 CORS Configuration
CorsConfig.java creates a CorsFilter bean with the following rules:
CORS Parameter	Value
Allowed Origins Pattern	http://localhost:* (any localhost port), http://127.0.0.1:* (any 127.0.0.1 port), FRONTEND_URL env variable (production URL)
Allowed Methods	GET, POST, PUT, DELETE, PATCH, OPTIONS
Allowed Headers	* (all headers)
Exposed Headers	Authorization, Content-Type
Allow Credentials	true
Applied to	All paths: /**
Note: allowedOriginPatterns is used instead of allowedOrigins to support wildcard port matching alongside allowCredentials=true (this combination is required — allowedOrigins with wildcard does not work with credentials).

9.3 Authentication Mechanism
Authentication is plain credential comparison:
•	Passwords are stored as plain text in the users table
•	AuthService.login() does: user.getPassword().equals(password) — direct string comparison
•	No hashing (BCrypt or SHA) is used
•	No JWT tokens, OAuth, or session management exists
•	The logged-in user object returned by the API is stored entirely in localStorage
CRITICAL RECOMMENDATION: Before any production enhancement, implement BCrypt password hashing using Spring Security's PasswordEncoder and add JWT-based stateless authentication.
 
10. ENVIRONMENT CONFIGURATION

10.1 Required Environment Variables
Variable Name	Description	Example Value
DATASOURCE_URL	Full JDBC URL for PostgreSQL database	jdbc:postgresql://localhost:5432/onedeoleela
DATASOURCE_USER	PostgreSQL username	postgres
DATASOURCE_PASSWORD	PostgreSQL password	1535
FRONTEND_URL	Production frontend URL for CORS whitelist	http://your-ec2-ip:3000 or http://yourdomain.com

10.2 Local Development Setup — Backend
•	Install JDK 17 (LTS) — verify with: java -version
•	Install Maven — verify with: mvn -version
•	Install PostgreSQL — create a database named onedeoleela
•	Set the environment variables listed above in your IDE run configuration or export them in your terminal
•	Navigate to the backend root (where pom.xml is located)
•	Run: mvn spring-boot:run
•	The application starts on port 8080 by default
•	On first run, DataInitializer creates the ADMIN user (eCode: 1001, password: admin@123)
•	Hibernate ddl-auto=update will create all tables automatically on startup

10.3 Local Development Setup — Frontend
•	Install Node.js (v18+ recommended)
•	Navigate to the frontend project directory (where package.json is located)
•	Run: npm install
•	Set the backend URL in your API calls. The frontend uses a base URL (typically http://localhost:8080) hardcoded or via environment variable in the service files
•	Run: npm start
•	The React development server starts on port 3000 by default
•	Login with eCode: 1001, password: admin@123

10.4 Backend URL Configuration in Frontend
IMPORTANT: The frontend API calls use a hardcoded base URL. Search for 'localhost:8080' or the production EC2 IP address across all .js files in the Module/ directory to find and update the backend URL if needed. There is no centralized axios instance or config file — each service file or page component makes fetch/axios calls directly.
 
11. BUILD, DEPLOYMENT, AND INFRASTRUCTURE

11.1 Backend Build
•	Build command: mvn clean package -DskipTests
•	Output: target/onedeoleela-<version>.jar (Spring Boot fat JAR)
•	The JAR includes all dependencies and an embedded Tomcat server
•	Run on server: java -jar target/onedeoleela-<version>.jar (with env variables set)

11.2 Frontend Build
•	Build command: npm run build
•	Output: build/ directory with static files (index.html, CSS, JS bundles)
•	Serve using: a static file server (e.g., nginx, serve, or npm's serve package)
•	Or deploy the build/ directory to an S3 bucket for static hosting

11.3 Deployment on Server PC 
•	 The application is deployed on a local network Windows PC with IP address 192.168.1.67.
•	Component	•	Detail
•	Server IP	•	192.168.1.67
•	Backend URL	•	http://192.168.1.67:8080

•	Frontend URL	•	http://192.168.1.67:3030

•	Backend:
•	The Spring Boot JAR runs as a Windows Service managed by NSSM (Non-Sucking Service Manager) on port 8080
•	To restart after a new JAR deployment: nssm start DispatchBackend in Command Prompt (Admin)
•	Environment variables are configured inside the NSSM service editor under the Environment tab
•	Frontend:
•	The React production build (npm run build) is served by Nginx on port 3030
•	To deploy a new build: replace the files in the Nginx root folder — no Nginx restart needed
•	Nginx config is located at <nginx-install-dir>/conf/nginx.conf
•	Network Access:
•	Accessible only within the local network
•	If the server IP changes, update FRONTEND_URL in NSSM and all API base URLs in the frontend code, then rebuild and redeploy
•	

11.4 Database
•	PostgreSQL runs on the EC2 instance or a separate RDS instance
•	Hibernate ddl-auto=update: Schema changes (new columns, new tables) are applied automatically on restart
•	CAUTION: ddl-auto=update can cause issues with column type changes or drops — always backup the database before deploying schema-breaking changes
•	No Flyway or Liquibase migration tool is used — schema is managed entirely by Hibernate


11.5 File Upload Storage
•	Uploaded files (production plan PDFs, vehicle activity images, expense receipts) are stored as byte arrays directly in the PostgreSQL database (FileEntity.data column)
•	This approach is suitable for small to medium files but will cause database size growth over time
•	The multipart size limit is set to 50MB per file in application.yaml
 
12. KNOWN ISSUES, TECHNICAL DEBT, AND PENDING WORK

12.1 Critical Security Issues
Issue ID	Severity	Description	Recommendation
SEC-001	CRITICAL	Passwords stored and compared as plain text with no hashing	Implement BCrypt password encoding using Spring Security PasswordEncoder
SEC-002	CRITICAL	No server-side authentication enforcement — all API endpoints are publicly accessible	Implement JWT-based authentication with Spring Security. Add @PreAuthorize or security filter to validate tokens on every request
SEC-003	HIGH	User session stored entirely in localStorage — vulnerable to XSS token theft	After JWT implementation, use HttpOnly cookies for token storage
SEC-004	MEDIUM	boss_session.txt written to server file system — not suitable for multi-instance deployment	Replace with database-backed session or Redis-based session management

12.2 Code Quality Issues
Issue ID	Severity	Description	Recommendation
CODE-001	MEDIUM	Large commented-out code blocks throughout the codebase (SecurityConfig, CorsConfig, AuthController have dozens of commented-out previous versions)	Clean up commented code — use Git history for version reference instead
CODE-002	MEDIUM	authService.js file incorrectly placed inside the Java Service package (src/main/java/.../Service/authService.js) — it is a frontend file in the wrong location	Remove from backend, ensure it is only in the frontend source
CODE-003	MEDIUM	TrackerFormPage.js (287KB) and TrackerSummaryPage.js (98KB) are extremely large single-file components — hard to maintain	Refactor into smaller sub-components using React component composition
CODE-004	LOW	No centralized API base URL configuration in frontend — each file hardcodes the backend URL	Create a constants.js or config.js with the API_BASE_URL and import it throughout
CODE-005	LOW	No global error handling or interceptor in frontend API calls	Implement an Axios interceptor or a fetch wrapper for centralized error handling
CODE-006	LOW	Console.out print statements scattered throughout backend services and controllers — not suitable for production	Replace with SLF4J Logger (use @Slf4j from Lombok)

12.3 Architectural Limitations
Issue ID	Severity	Description	Recommendation
ARCH-001	MEDIUM	Files (images, PDFs) stored as BLOBs in PostgreSQL — will cause significant database size growth	Move file storage to AWS S3; store only the S3 key in the database
ARCH-002	MEDIUM	No database migration tool — Hibernate ddl-auto=update is used in production	Introduce Flyway or Liquibase for controlled, versioned schema migrations
ARCH-003	LOW	EAGER fetch type used on Window entity relationships (Flat, Floor, Trip) — may cause N+1 query issues at scale	Evaluate using LAZY loading with explicit JOIN FETCH queries where needed
ARCH-004	LOW	No unit tests or integration tests exist (only a blank test class OnedeoleelaApplicationTests.java)	Add JUnit 5 tests for Services and MockMvc tests for Controllers

12.4 Pending Features
•	Email notification system for vehicle requests and appointment confirmations
•	Role-based access control enforced at API level (currently only on frontend)
•	Pagination for large data sets (TrackerSheetRows, DailyProgressReport, Items)
•	TrackerPage_Updated.js exists as an updated version of TrackerPage.js — needs validation and replacement of the old file
•	Search and filter capabilities on most list pages are limited or absent
•	PDF export for TrackerSheet summary is not yet implemented on backend
 
13. GLOSSARY

Term	Definition
eCode	Employee Code — a unique numeric identifier assigned to each employee. Used as the username for login.
WO	Work Order — a formal document (work_orders table) describing facade work to be done for a project.
Info Sheet	A measurement and specification sheet linked to a Work Order, capturing details per flat.
Tracker Sheet	A production progress tracking sheet (tracker_sheets, tracker_sheet_rows) with Supply, Installation, and Hardware sub-columns.
DC	Delivery Challan — a document accompanying goods delivery. Window DC and Item DC are managed in the Dispatch module.
Sqft	Square Feet — the unit of measurement for facade area. Calculations convert mm dimensions to sqft using the factor 10.764 per sqm.
BOSS Session File	boss_session.txt — a file written to the server's home directory when the BOSS role user logs in, used to signal an Electron desktop widget.
ddl-auto=update	Hibernate configuration that automatically alters the database schema to match entity definitions on application startup.
Fat JAR	A self-contained Spring Boot executable JAR file that includes all dependencies and an embedded Tomcat server.
SPA	Single Page Application — the React frontend loads once and manages navigation client-side via React Router.
CORS	Cross-Origin Resource Sharing — browser security mechanism allowing the frontend (on one origin) to call the backend API (on another origin).
DTOs	Data Transfer Objects — classes used to shape API request/response payloads differently from JPA entities (used in Coordinator module).
PDFBox	Apache PDFBox — Java library used to programmatically generate the Planning Schedule PDF report.
PA	Personal Assistant — the role that manages appointments for the BOSS.
 
14. DOCUMENT REVISION HISTORY

Version	Date	Author	Description of Change
1.0	June 12, 2026	Siddharth Kamble	Initial release — Full handover document covering all modules, entities, APIs, security, deployment, and known issues. Prepared for team handover on departure from One Deo Leela Facade Systems Pvt. Ltd.

END OF DOCUMENT — ODL-ERP-HANDOVER-2026-001 | IEEE STD 1063 Compliant | CONFIDENTIAL


## 📬 Contact

For any queries, reach out via GitHub Issues or email the project maintainer.

> ⭐ If you find this project useful, please give it a star on GitHub!
