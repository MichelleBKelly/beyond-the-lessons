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