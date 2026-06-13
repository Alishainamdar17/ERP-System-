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

## 📬 Contact

For any queries, reach out via GitHub Issues or email the project maintainer.

> ⭐ If you find this project useful, please give it a star on GitHub!
