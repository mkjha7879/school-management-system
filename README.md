# School Management System

Full-stack school management app with **React** frontend, **Spring Boot** backend, and **Firebase Firestore** database.

## Features

- Dashboard with student, teacher, and class counts
- Student management (CRUD)
- Teacher management (CRUD)
- Class management with teacher assignment (CRUD)
- Admin login (demo credentials)

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| Backend  | Spring Boot 3, Java 17              |
| Database | Firebase Realtime Database          |

## Project Structure

```
├── src/                  # React frontend
│   ├── api/              # API client
│   ├── components/       # Shared UI components
│   ├── pages/            # Dashboard, Students, Teachers, Classes
│   └── types/            # TypeScript interfaces
└── backend/              # Spring Boot API
    └── src/main/java/com/school/management/
```

## Prerequisites

- **Node.js** 18+
- **Java** 17+
- **Maven** 3.8+
- **Firebase** project with Firestore enabled

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Realtime Database** (already done for project `school-management-system-79732`).
3. Go to **Project Settings → Service accounts → Generate new private key**.
4. Save the JSON file as:
   ```
   backend/src/main/resources/firebase-service-account.json
   ```

See **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** for step-by-step instructions.

## Realtime Database Structure

The backend uses these paths:

- `/students/{id}`
- `/teachers/{id}`
- `/classes/{id}`

## Run the Application

You need **both** the backend and frontend running. If only the frontend is running, you'll see API errors on the dashboard.

### Quick start (recommended)

**Terminal 1 — Backend** (no Firebase needed in local mode):
```bash
./scripts/start-backend.sh
```

**Terminal 2 — Frontend:**
```bash
npm install
npm run dev
```

- Backend API: `http://localhost:8080`
- Frontend UI: `http://localhost:5173`

### Manual start

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

### Firebase mode (your Realtime Database)

After placing the service account JSON (see FIREBASE_SETUP.md):
```bash
./scripts/start-backend-firebase.sh
```

The Vite dev server proxies `/api` requests to the Spring Boot backend.

## Demo Login

| Email              | Password  |
|--------------------|-----------|
| admin@school.com   | admin123  |

## API Endpoints

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/dashboard/stats  | Dashboard counts   |
| GET    | /api/students         | List students      |
| POST   | /api/students         | Create student     |
| PUT    | /api/students/{id}    | Update student     |
| DELETE | /api/students/{id}    | Delete student     |
| GET    | /api/teachers         | List teachers      |
| POST   | /api/teachers         | Create teacher     |
| PUT    | /api/teachers/{id}    | Update teacher     |
| DELETE | /api/teachers/{id}    | Delete teacher     |
| GET    | /api/classes          | List classes       |
| POST   | /api/classes          | Create class       |
| PUT    | /api/classes/{id}     | Update class       |
| DELETE | /api/classes/{id}    | Delete class       |
