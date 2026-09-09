# Beyond the Lessons — Architecture

## 1. Architecture Overview

Beyond the Lessons is a web application connecting Thai schools with English-speaking volunteers.

The architecture should be simple enough for an MVP while allowing the platform to scale to multiple schools, classrooms, and volunteers.

### Core flow

School
→ Creates session
→ Session becomes OPEN
→ System finds eligible volunteers
→ Volunteers receive email
→ First volunteer claims session
→ Session becomes CLAIMED/CONFIRMED
→ External video call
→ Session completed
→ Hours recorded
→ Feedback collected

---

## 2. Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend / Infrastructure
- Firebase
  - Firebase Authentication
  - Cloud Firestore
  - Cloud Functions where needed

### Email
External transactional email provider.

Such as:
- Resend
- SendGrid
- Mailgun

Email sending should happen server-side.

### Video
Use external video services:
- Google Meet
- Zoom

The platform only stores the meeting URL.

### Hosting
- Vercel

---

## 3. High-Level Components

```text
                ┌─────────────────────┐
                │      React App      │
                │      Frontend       │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Firebase Auth       │
                │ User authentication │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     Firestore       │
                │     Database        │
                └──────────┬──────────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
        ┌────────────────┐   ┌────────────────┐
        │ Cloud Functions│   │ Email Provider │
        │ Business Logic │──▶│ Notifications  │
        └────────────────┘   └────────────────┘