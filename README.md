# Axion AI

Axion AI is a full-stack authentication and chat workspace built with an Express + MongoDB backend and a React + Vite frontend. The current implementation focuses on user registration, email verification, login, session retrieval, and a protected dashboard entry point that is prepared for chat features.

## What Is In This Repo

The repository is split into two applications:

- `backend/` contains the Express API, MongoDB connection, auth routes, validators, mail service, and JWT-based session handling.
- `frontend/` contains the React application, Redux store, auth hooks, auth API client, and the login/register screens.

## Current Feature Set

- User registration with username, email, and password.
- Duplicate user prevention for both email and username.
- Email verification through a tokenized verification link.
- Login with password validation and verified-email checks.
- Cookie-based JWT session creation on successful login.
- `get-me` endpoint for restoring the current user from the session cookie.
- React auth forms with controlled inputs and route-based navigation between login and register pages.
- Redux-backed client state for `user`, `loading`, and `error`.
- Frontend API layer using Axios with `withCredentials: true` enabled.

## Tech Stack

- Backend: Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, CORS, Morgan, express-validator.
- Frontend: React 19, Vite, React Router, Redux Toolkit, React Redux, Axios, Tailwind CSS.
- Auth model: email verification + JWT session cookie.

## Project Structure

```text
README.md
backend/
  package.json
    config/database.js
    controllers/auth.controller.js
    middleware/auth.middleware.js
    model/
    routes/auth.router.js
    services/
    validators/auth.validator.js
frontend/
  package.json
  vite.config.js
  src/
    main.jsx
    app/
    features/
      auth/
      chat/
```

## Step-By-Step Implementation So Far

### 1. Set up the backend entry point

The backend starts from [`backend/server.js`](backend/server.js) and performs three things in order:

- loads environment variables with `dotenv`.
- connects to MongoDB through [`backend/src/config/database.js`](backend/src/config/database.js).
- starts the Express server on `process.env.PORT` or `8000` by default.

This means the backend will not start if the database connection fails.

- The current setup will only work correctly if the backend port, frontend base URL, and email links all point to the same reachable backend host.

- enables request logging with `morgan("dev")`.
- parses JSON and URL-encoded bodies.
- reads cookies with `cookie-parser`.
- allows cross-origin requests from the frontend development server at `http://localhost:5173`.
- mounts the auth router at `/api/auth`.
- exposes a health check route at `/`.

### 3. Add authentication routes

The auth router in [`backend/src/routes/auth.router.js`](backend/src/routes/auth.router.js) exposes these endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify-email`
- `GET /api/auth/get-me`

The routes are protected or validated as needed using `registerValidator`, `loginValidator`, and `authUser`.

### 4. Add request validation

Validation is handled in [`backend/src/validators/auth.validator.js`](backend/src/validators/auth.validator.js).

- `username` must exist, be 3-30 characters long, and only contain letters, numbers, or underscores.
- `email` must exist and be a valid email address.
- `password` must exist and be at least 6 characters long for registration.
- login only requires a valid email and a non-empty password.

Validation errors are returned as HTTP `400` responses with an `errors` array.

### 5. Implement auth controller logic

The controller in [`backend/src/controllers/auth.controller.js`](backend/src/controllers/auth.controller.js) currently supports:

- `register`: checks for existing users, creates a new user, generates an email verification token, and sends a verification email.
- `login`: finds the user by email, validates the password, rejects unverified users, signs a JWT, and stores it in a cookie.
- `verifyEmail`: validates the verification token, marks the user as verified, and returns a success message.
- `getMe`: loads the current user from the JWT session and strips the password field.

### 6. Configure email delivery

The mail service in [`backend/src/services/mail.service.js`](backend/src/services/mail.service.js) uses Nodemailer with Gmail OAuth2 credentials.

You need the following environment variables for email verification to work:

- `GOOGLE_USER`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

### 7. Build the frontend auth flow

The frontend auth form screens are:

- [`frontend/src/features/auth/pages/Login.jsx`](frontend/src/features/auth/pages/Login.jsx)
- [`frontend/src/features/auth/pages/Register.jsx`](frontend/src/features/auth/pages/Register.jsx)

Each form uses controlled inputs with `useState`, a submit handler, and a `Link` for moving between routes.

The current UI implementation includes:

- a dark, high-contrast visual style.
- cyan accent colors for focus states and buttons.
- responsive centered card layouts.
- explicit form labels and placeholders.

### 8. Connect the frontend to the backend API

The Axios client is defined in [`frontend/src/features/auth/services/auth.api.js`](frontend/src/features/auth/services/auth.api.js).

- `register()` sends `POST /api/auth/register`.
- `login()` sends `POST /api/auth/login`.
- `getMe()` sends `GET /api/auth/get-me`.
- `withCredentials: true` is enabled so cookies can be sent with requests.

The auth hook in [`frontend/src/features/auth/hook/use.auth.js`](frontend/src/features/auth/hook/use.auth.js) wraps these requests and updates Redux state.

### 9. Manage client state with Redux

Auth state lives in [`frontend/src/features/auth/auth.slice.js`](frontend/src/features/auth/auth.slice.js).

- `user` stores the authenticated user object.
- `loading` tracks request progress.
- `error` stores the latest auth error message.

The store is wired up in [`frontend/src/app/app.store.js`](frontend/src/app/app.store.js) and provided from [`frontend/src/main.jsx`](frontend/src/main.jsx).

### 10. Add application routing

Routing is defined in [`frontend/src/app/app.routes.jsx`](frontend/src/app/app.routes.jsx).

- `/login` renders the login screen.
- `/register` renders the registration screen.
- `/` renders the dashboard screen.

The app wrapper in [`frontend/src/app/App.jsx`](frontend/src/app/App.jsx) also triggers `handleGetMe()` on load to restore the current user from the session cookie.

## Local Setup

### Prerequisites

- Node.js 18 or newer.
- MongoDB connection string.
- Gmail OAuth2 credentials for outbound verification email.

### 1. Install dependencies

Run the installs separately in each app:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend/`.

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GOOGLE_USER=your_gmail_address
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
```

Notes:

- `JWT_SECRET` is required for both email verification tokens and login sessions.
- The backend currently sends verification links to `http://localhost:3000/api/auth/verify-email?...` and login redirects are also written with `localhost:3000` in the email templates, so update those URLs if your backend runs on a different port.
- The frontend Axios client currently points to `http://localhost:3000`, while the backend defaults to port `8000`. Make sure those values match before testing the auth flow.

### 3. Start the backend

```bash
cd backend
npm run dev
```

This starts the API with nodemon and launches the server after MongoDB connects.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

This starts the Vite dev server, typically on `http://localhost:5173`.

## Auth Flow Summary

### Registration

1. The user fills in username, email, and password on the register page.
2. The frontend sends the payload to `POST /api/auth/register`.
3. The backend validates the request body.
4. The backend checks whether the username or email already exists.
5. A new user record is created in MongoDB.
6. A verification token is generated with JWT.
7. A verification email is sent to the user.

### Email Verification

1. The user clicks the verification link from the email.
2. The backend verifies the JWT token from the query string.
3. The related user account is marked as verified.
4. The user can now log in.

### Login

1. The user submits email and password.
2. The frontend sends the payload to `POST /api/auth/login`.
3. The backend validates the credentials.
4. If the account is verified, a JWT is signed.
5. The token is saved in an HTTP cookie.
6. The frontend can call `GET /api/auth/get-me` to restore the user.

## API Reference

### `POST /api/auth/register`

Request body:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "message": "User registered successfully",
  "success": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### `POST /api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

Success response:

```json
{
  "message": "Login successful",
  "success": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### `GET /api/auth/verify-email?token=...`

Marks the account as verified if the token is valid.

### `GET /api/auth/get-me`

Returns the current user from the session cookie.

## Notes For Development

- The app currently assumes cookie-based authentication and cross-origin requests, so the backend CORS config must stay aligned with the frontend origin.
- The frontend login and register pages navigate immediately after submit; if you want stricter success handling, check the API response before redirecting.
- The dashboard route is already mounted, but the chat experience itself still appears to be in progress.

## Next Useful Improvements

- Add a `.env.example` file for both frontend and backend configuration.
- Make the backend and frontend base URLs configurable through environment variables.
- Add loading and error messages directly in the auth screens.
- Protect the dashboard route with an authenticated route guard.
- Document the chat features once the dashboard is implemented.
