# Firebase Setup (Your Project)

Your Firebase project:

| Setting | Value |
|---------|-------|
| Project ID | `school-management-system-79732` |
| Database | Realtime Database |
| Database URL | `https://school-management-system-79732-default-rtdb.firebaseio.com` |

The backend service-account key is already placed at
`backend/src/main/resources/firebase-service-account.json` (gitignored).

---

## You must do 2 things in the Firebase Console

These require your Google login — they cannot be automated.

### 1. Enable Email/Password authentication

1. Open: [Authentication → Sign-in method](https://console.firebase.google.com/project/school-management-system-79732/authentication/providers)
2. Click **Email/Password** → toggle **Enable** → **Save**

After this, restart the backend and it will auto-create the admin account:

```
Email:    admin@school.com
Password: admin123
```

(Change the password after first login. You can override defaults with
`ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars.)

### 2. Register a Web App and copy its config

1. Open: [Project settings → General](https://console.firebase.google.com/project/school-management-system-79732/settings/general)
2. Under **Your apps**, click the **Web** icon (`</>`), register an app
3. Copy the values from the `firebaseConfig` snippet
4. Create a file named `.env` in the project root (copy from `.env.example`):

```
VITE_FIREBASE_API_KEY=AIza...your-key
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
```

(`authDomain`, `databaseURL`, `projectId`, `storageBucket` already default
to your project, so only these three are required.)

---

## Run it

**Terminal 1 — backend:**
```bash
./scripts/start-backend-firebase.sh
```

**Terminal 2 — frontend:**
```bash
npm run dev
```

Open `http://localhost:5173` and sign in as `admin@school.com` / `admin123`.

---

## How auth & roles work

- Login uses **Firebase Authentication** (email/password) in the browser.
- The browser sends the Firebase **ID token** with every API request.
- Spring Boot **verifies the token** and reads the user's **role** from a Firebase
  custom claim (`ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
- The **Admin** can create users and assign roles under **Users & Roles**.

## How real-time works

- Spring Boot exposes a **WebSocket (STOMP over SockJS)** endpoint at `/ws`.
- When any data changes, the backend broadcasts to topics like `/topic/dashboard`.
- The React dashboard subscribes and updates **live** (look for the green ● LIVE badge).

## Realtime Database structure

```
/users/{uid}        → role, email, displayName
/students/{id}
/teachers/{id}
/classes/{id}
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login error `CONFIGURATION_NOT_FOUND` | Enable Email/Password (step 1) |
| Login error `auth/invalid-api-key` | Add web config to `.env` (step 2), restart `npm run dev` |
| Dashboard shows 403 | You're not signed in, or token expired — sign in again |
| No live updates | Make sure backend is running; check browser console for `/ws` errors |
