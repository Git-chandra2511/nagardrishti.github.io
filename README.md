# Nagar Drishti — Frontend

This is a complete React/Vite frontend for the Nagar Drishti civic issue platform.

## Run
From the `frontend` folder:

```bash
npm install
npm run dev
```

The app works immediately in local demo mode using localStorage.

## Firebase
Copy `.env.example` to `.env` and add the Firebase Web App configuration when ready.
The UI remains usable without Firebase configuration, so you can demo first and connect Firebase afterward.

## Build
`npm run build`

The Vite build is configured to output to the parent project's `dist` folder, matching Firebase Hosting configuration.
