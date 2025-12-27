 # JobMatch – Role-Based Job Matching Platform

JobMatch is a full-stack job matching platform where candidates discover relevant job opportunities and explicitly opt in, while companies only see candidates who have shown interest.

The system focuses on **quality hiring signals**, not spam applications.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Google OAuth login
- JWT-based authentication
- Role-based access control (Candidate / Company)
- Protected frontend routes

---

### 👤 Candidate Flow
- Create candidate profile (skills, experience)
- Upload resume (local storage)
- View recommended jobs based on profile
- Opt-in / decline job opportunities

---

### 🏢 Company Flow
- Create job postings
- View only candidates who opted in
- Access candidate resumes directly

---

### 🎨 UI / UX
- Built with React + TypeScript
- Styled using Tailwind CSS
- Responsive and clean layout
- Auth-aware navigation with logout

---

## 🛠 Tech Stack

### Backend
- Go (Golang)
- Gin framework
- GORM ORM
- PostgreSQL
- JWT authentication
- Docker & Docker Compose

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Google OAuth

---

## 🛠️ Setup & Run Locally

### 📌 Prerequisites

Ensure you have the following installed:

- Git
- Node.js (v18+)
- npm
- Docker & Docker Compose
- Google Cloud Console account (for OAuth)

---

### 🔑 Google OAuth Setup

1. Go to **Google Cloud Console**
2. Create a new project
3. Enable **Google Identity Services**
4. Create **OAuth 2.0 Client ID**
   - Application type: Web
   - Authorized JavaScript origin:
     ```
     http://localhost:5173
     ```
5. Copy the **Client ID**

---

### 🐳 Backend Setup (Go + PostgreSQL)

Clone the repository:

```bash
git clone https://github.com/your-username/jobmatch.git
cd jobmatch