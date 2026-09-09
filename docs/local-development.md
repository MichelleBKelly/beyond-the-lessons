# Local Development

The repository has two workspaces:

- `frontend/`: Vite, React, TypeScript, and the browser Firebase client.
- `backend/`: Firebase project configuration, Firestore rules, Emulator Suite configuration, and Cloud Functions.

## Prerequisites

- Node.js 20 or newer
- Java installed for the Firebase Firestore emulator
- Firebase CLI: `npm install --global firebase-tools`

## Configure Firebase

1. Create a Firebase project and register a web app.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Fill in the `VITE_FIREBASE_*` values from Firebase Console.
4. Set `VITE_USE_FIREBASE_EMULATORS=true` in `frontend/.env.local` when using the local Emulator Suite.
5. Copy `backend/functions/.env.example` to `backend/functions/.env`.
6. Add a Resend API key and a verified sender address when email notifications are needed. The emulator can run without these values; it will log that email delivery was skipped.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

## Run the Firebase backend locally

In a second terminal:

```powershell
cd backend/functions
npm install
npm run build
cd ..
firebase emulators:start --only auth,firestore,functions
```

The Emulator UI is available at `http://localhost:4000`. The local services use the ports declared in [backend/firebase.json](../backend/firebase.json): Auth `9099`, Firestore `8080`, Functions `5001`, and Emulator UI `4000`.

The frontend automatically connects Auth and Firestore to these emulators when `VITE_USE_FIREBASE_EMULATORS=true` and Vite is running in development mode.

## Run checks

Frontend:

```powershell
cd frontend
npm run build
npm run lint
npm run test
```

Backend:

```powershell
cd backend/functions
npm run build
```

## Deploy backend

```powershell
cd backend
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,functions
```

Store `RESEND_API_KEY` with Firebase Secret Manager for deployed Functions. Do not commit `.env` files or email credentials.