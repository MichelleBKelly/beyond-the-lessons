# Beyond the Lessons

An app connecting volunteers with schools in Thailand to help students build confidence through conversational English.

## MVP setup

The app lives in `frontend/` and keeps the existing Vite + React setup. Use Node 20 or newer.

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Add the web app configuration from Firebase Console to the `VITE_FIREBASE_*` values.
3. In Firebase Authentication, enable Email/Password sign-in.
4. Create a Firestore database and deploy the backend rules:

```powershell
firebase login
firebase use YOUR_PROJECT_ID
cd backend
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules
```

5. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Useful checks are `npm run build`, `npm run lint`, and `npm run test` from `frontend/`.

## Architecture notes

- Firebase Auth identifies users; the `users` document stores the role and approval status.
- Firestore stores users, sessions, and feedback. Session claiming uses a Firestore transaction and is also restricted by `firestore.rules`.
- Times are stored as a local date/time plus IANA timezone, so a Bangkok school schedule can be rendered correctly for a volunteer in Canada. Production calendar displays should convert the stored value with `Intl.DateTimeFormat` in the viewer's timezone.
- Recurring sessions are represented as individual occurrence documents. `src/domain/recurring.ts` contains the deterministic occurrence generator used by the MVP.
- Email notifications run in `backend/functions` or another server-side worker. No email credentials are read by the frontend.

## Manual production configuration still required

- Add the Firebase web app environment values to Vercel, and configure the authorized domain in Firebase Authentication.
- Deploy Firestore rules and create any required indexes suggested by the Firebase console.
- Configure a transactional email provider such as Resend, SendGrid, or Mailgun in Cloud Functions. Add triggers for approvals, new eligible sessions, claims, cancellations, and backing out.
- Configure the Functions package in `backend/functions` with the provider secret stored in Secret Manager. The backend includes a callable atomic claim path and Firestore notification triggers.
- Create at least one admin user by setting its `users/{uid}.role` to `admin` through a trusted admin process. Do not allow users to self-select admin in production.
- Add Vercel environment variables and deploy `frontend` with `npm run build`.
