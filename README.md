# 🧪 Multi-Tenant Admin Portal (2-Day POC)

A lightweight full-stack proof-of-concept admin portal built to simulate multi-tenant onboarding, source configuration, pipeline control, role-based access, and system health monitoring.

---

## 🚀 Features

### ✅ Day 1 – Core Functionality
- **Customer Onboarding**: Add tenants with name, email, timezone.
- **Source Configuration**: Save DB host, port, username, password (linked to each tenant).
- **Pipeline Toggle**: Start/Stop pipeline per tenant (simulated status flag).

### ✅ Day 2 – Extended Functionality
- **System Health Snapshot**: Simulated sync/error data shown in colored status table (green/yellow/red).
- **Role-Based Access (Admin/Viewer)**: UI hides toggle controls for Viewer role.
- **JWT Authentication**: Login with role-based token, stored in localStorage.

---

## 🧰 Tech Stack

| Layer         | Tech                        |
|--------------|-----------------------------|
| Frontend     | React.js                    |
| Backend      | FastAPI (Python)            |
| Database     | PostgreSQL                  |
| Auth         | JWT-based token auth        |
| ORM          | SQLAlchemy                  |
| DevOps       | Docker + Docker Compose     |

---

## 🖼️ UI Snapshots



## 📁 Project Structure

admin-portal/
├── backend/
│ ├── main.py # FastAPI app
│ ├── models.py # SQLAlchemy models
│ ├── crud.py # DB logic
│ ├── schemas.py # Pydantic schemas
│ ├── database.py # DB session handling
│ └── Dockerfile # Backend Docker setup
├── frontend/admin-portal
│ ├── src/pages/ # React Pages
│ ├── App.js # Routing logic
│ └── Dockerfile # Frontend Docker setup
├── docker-compose.yml # Compose for backend, frontend, DB
└── README.md

---

## 🐳 Run with Docker Compose

### Prerequisites:
- Docker + Docker Compose installed

### Steps:
```bash
# 1. Clone the repo
git clone https://github.com/JainAbhi2411/admin-portal.git
cd admin-portal

# 2. Run everything
docker-compose up --build

Backend: http://localhost:8000

Frontend: http://localhost:3000

DB: PostgreSQL exposed on port 5432

🙌 Author
Abhinav Jain
💻 Full-Stack Developer
📧 jainabhi7374@gmail.com

