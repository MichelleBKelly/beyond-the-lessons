# Backend

Firebase configuration, Firestore rules, and Cloud Functions live here.

From this directory:

```powershell
npm install
firebase emulators:start --only auth,firestore,functions
```

The Functions package can also be run directly with `cd functions; npm install; npm run build`.
