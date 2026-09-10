# Run Locally

Set `VITE_USE_FIREBASE_EMULATORS=true` in `frontend/.env.local` first.

## Terminal 1: Firebase backend

```powershell
cd C:\Users\Miche\Documents\GitHub\beyond-the-lessons\backend\functions
npm.cmd install
npm.cmd run build
cd ..
npx firebase-tools emulators:start --only auth,firestore,functions
```

## Terminal 2: Frontend

```powershell
cd C:\Users\Miche\Documents\GitHub\beyond-the-lessons\frontend
npm.cmd install
npm.cmd run dev
```

Open the app at `http://localhost:5173`.

Open the Firebase Emulator UI at `http://localhost:4000`.

The local frontend uses the emulator project configured in `frontend/.env.local`.
Emulator email delivery is skipped unless the Functions environment has a
`RESEND_API_KEY`; successful signup and session creation can still be tested in
the Firestore Emulator UI. The admin approval screen is available at
`/admin/users` after signing in with a user whose `role` is `admin`.

To test the complete workflow:

1. Create a school and volunteer account at `/auth?mode=signup`.
2. In Firestore, set both profiles' `approvalStatus` to `approved`.
3. Sign in as the school and create an open session.
4. Sign in as the volunteer and claim the session.
5. To test the admin screen, set one profile's `role` to `admin`, sign in again,
   and approve or reject pending applications at `/admin/users`.

For production email delivery, configure the Functions secret and sender:

```powershell
firebase functions:secrets:set RESEND_API_KEY
$env:FRONTEND_URL = "https://your-frontend.example.com"
```

## Promotion order

Keep local development and production separate. The checked-in examples are
templates only; never commit `.env.local` or Functions `.env` files.

### 1. Local development

Use `frontend/.env.local` with `VITE_USE_FIREBASE_EMULATORS=true` and the local
demo project ID. Start the emulators and frontend, then test signup, approval,
session creation, claiming, and feedback against `localhost`.

Run these checks before sharing anything:

```powershell
npm.cmd --prefix frontend run test
npm.cmd --prefix frontend run lint
npm.cmd --prefix frontend run build
npm.cmd --prefix backend/functions run build
```

### 2. Private staging

Create a separate Firebase project for staging. Add its web-app values to the
hosting provider as environment variables with
`VITE_USE_FIREBASE_EMULATORS=false`. Deploy Firestore rules and Functions to
staging, create one admin, and test the complete workflow with test accounts.
Use a preview deployment or password protection for the frontend so it is not
publicly discoverable.

### 3. Production

Only after staging passes, create or select the production Firebase project.
Configure its Auth authorized domains, Firestore rules, Functions secrets, and
Resend sender domain. Add the production `VITE_FIREBASE_*` variables to the
hosting provider, deploy the frontend, then verify signup and email delivery
with controlled test accounts.

Keep separate admin accounts and data for local, staging, and production. Do
not point local development at production, and do not use the demo project ID
for a public deployment.

## Test checks

```powershell
cd C:\Users\Miche\Documents\GitHub\beyond-the-lessons\frontend
npm.cmd run test
npm.cmd run build
```

```powershell
cd C:\Users\Miche\Documents\GitHub\beyond-the-lessons\backend\functions
npm.cmd run build
```