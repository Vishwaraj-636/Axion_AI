# Axion AI

Axion AI is a full-stack authentication and chat workspace built with an Express + MongoDB backend and a React + Vite frontend. The current implementation focuses on user registration, email verification, login, session retrieval, and a protected dashboard entry point that is prepared for chat features.
Axion AI is a full-stack, AI-powered chat application built with an Express + MongoDB backend and a React + Vite frontend. It features a complete authentication system and a real-time, responsive chat workspace.

## What Is In This Repo

The repository is split into two main applications:

- `backend/` contains the Express API, MongoDB connection, auth routes, validators, mail service, and JWT-based session handling.
- `backend/` contains the Express API, MongoDB connection, auth routes, real-time chat logic with Socket.IO, and AI service integrations using LangGraph.
- `frontend/` contains the React application, Redux store, auth hooks, auth API client, and the login/register screens.

## Current Feature Set

- User registration with username, email, and password.
- Duplicate user prevention for both email and username.
- Email verification through a tokenized verification link.
- Login with password validation and verified-email checks.
- Cookie-based JWT session creation on successful login.
- A protected dashboard entry point that initializes a Socket.io connection.
- Real-time, streaming AI responses via WebSockets (Socket.IO).
- Persistent chat history saved and retrieved from the database.
- AI-powered responses from Google Gemini, orchestrated with LangGraph.
- Automatic, concise chat title generation from Mistral AI.
- Rich Markdown rendering for AI messages, including code blocks.
- Responsive chat UI with a collapsible sidebar for conversation history.
- `get-me` endpoint for restoring the current user from the session cookie.
- React auth forms with controlled inputs and route-based navigation between login and register pages.
- Redux-backed client state for `user`, `loading`, and `error`.
- Frontend API layer using Axios with `withCredentials: true` enabled.

## Tech Stack

- Backend: Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, CORS, Morgan, express-validator.
- Frontend: React 19, Vite, React Router, Redux Toolkit, React Redux, Axios, Tailwind CSS.
- Backend: Express, MongoDB, Mongoose, JWT, bcrypt, Nodemailer, CORS, Morgan, express-validator, **Socket.io, LangChain.js, LangGraph**.
- Frontend: React 19, Vite, React Router, Redux Toolkit, React Redux, Axios, Tailwind CSS, **Socket.IO Client, react-markdown**.
- Auth model: email verification + JWT session cookie.

## Project Structure

```text
README.md
backend/
  package.json
    config/database.js
    controllers/auth.controller.js
    controllers/chat.controller.js
    middleware/auth.middleware.js
    model/
      chat.model.js
      message.model.js
    routes/auth.router.js
    routes/chat.routes.js
    services/
      ai.service.js
    validators/auth.validator.js
frontend/
  package.json
  vite.config.js
  src/
    main.jsx
    app/
      app.routes.jsx
    features/
      auth/
      chat/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── chat.controller.js
│   ├── middleware/
│   ├── models/
│   │   ├── chat.model.js
│   │   ├── message.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.router.js
│   │   └── chat.routes.js
│   ├── services/
│   │   ├── ai.service.js
│   │   └── mail.service.js
│   ├── validators/
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── features/
    │   │   ├── auth/
    │   │   └── chat/
    │   ├── hooks/
    │   ├── services/
    │   └── main.jsx
    └── vite.config.js
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

### 6.5. Implement AI Services

The AI service in `backend/src/services/ai.service.js` integrates with Google Gemini for generating chat responses and Mistral AI for creating concise chat titles.

You need the following environment variables for AI services to work:

- `GEMINI_API_KEY`
- `MISTRAL_API_KEY`
- `TAVILY_API_KEY`

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

### 11. Implement the Dashboard and Socket.io Connection

- The `frontend/src/features/chat/pages/DashBoard.jsx` component serves as the protected entry point after successful login.
- It uses the `useChat` hook (defined in `frontend/src/features/chat/hook/useChat.js`) to manage chat-related functionalities.
- Upon mounting, it initializes a Socket.io connection to the backend, preparing for real-time communication.
- The dashboard currently displays a placeholder "Hello world".
- The `Login.jsx` component now also includes a check to redirect authenticated users directly to the dashboard (`/`) if they are already logged in.


### 12. Define Chat and Message Database Models

- In `backend/src/models/`, `chat.model.js` and `message.model.js` were created to persist conversation data.
- The `Chat` model links to a `User` via an `owner` field and stores a `title`.
- The `Message` model links to a `Chat` and stores the `content` and `role` (`user` or `assistant`), allowing for retrieval of entire conversation threads.

### 13. Add Chat API Routes and Controller Logic

- The `backend/src/routes/chat.routes.js` file exposes RESTful endpoints for managing chats.
- `GET /api/chats`: Fetches all chat histories for the authenticated user to populate the sidebar.
- `GET /api/chats/:chatId/messages`: Fetches all messages for a specific chat, displayed when a user selects a conversation.
- The controller logic is handled in `backend/src/controllers/chat.controller.js`.

### 14. Implement Real-time Chat with Socket.io

- The main server file (`backend/server.js`) was updated to initialize a Socket.IO server.
- A connection handler listens for new clients and handles a `message` event.
- When a `message` is received, it's processed by the AI service, and the response is streamed back to the client over the same socket connection.

### 15. Build the Frontend Chat UI

- The dashboard in `frontend/src/features/chat/pages/DashBoard.jsx` was built into a full chat interface.
- It is composed of several components: `ConversationHistory.jsx` (sidebar), `MessageList.jsx` (main message view), and `MessageInput.jsx` (input form).
- The layout is responsive and styled with Tailwind CSS.

### 16. Implement the `useChat` Custom Hook

- The `frontend/src/features/chat/hook/useChat.js` custom hook centralizes all chat-related logic and state management.
- It is responsible for:
    - Initializing and managing the Socket.IO client connection (`initializeSocketConnection`).
    - Fetching the user's chat history from the backend (`handleGetChats`).
    - Opening a specific chat and loading its messages (`handleOpenChat`).
    - Sending new messages to the backend via Socket.IO (`handleSendMessage`).
- It dispatches actions to the Redux store to update the chat state (e.g., adding new messages, setting the current chat).

### 17. Frontend Chat State Management with Redux

- A dedicated Redux slice (e.g., `frontend/src/features/chat/chat.slice.js`) manages the application's chat state.
- It stores an array of `chats` (conversation history) and the `currentChatId` to track the active conversation.
- Messages for the `currentChatId` are stored within the `chats` object, allowing for a complete view of the current conversation.
- Redux actions are used to add new messages, update chat titles, and switch between conversations, ensuring a predictable state flow.

### 18. Real-time Message Display and Markdown Rendering

- The `DashBoard.jsx` component dynamically renders messages from the Redux store.
- User messages are displayed as plain text, while AI responses are processed and rendered using `react-markdown`.
- Custom components are provided to `ReactMarkdown` to ensure beautiful and consistent styling for various markdown elements, including:
    - Headings (`h1`, `h2`, `h3`)
    - Lists (`ul`, `ol`, `li`)
    - Code blocks (`code`) with syntax highlighting (if configured) and a copy button.
    - Bold text (`strong`)
    - Links (`a`)
    - Blockquotes (`blockquote`)
- This ensures that AI-generated content, which often includes markdown, is presented clearly and aesthetically.


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

GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
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

### `GET /api/chats`

Returns an array of all chats for the authenticated user. Requires a valid session cookie.

### `GET /api/chats/:chatId/messages`

Returns an array of all messages for the specified chat ID. Requires a valid session cookie.

### `POST /api/chats/message`

Sends a new message to the AI. If `chatId` is not provided, a new chat is created.

### `DELETE /api/chats/delete/:chatId`

Deletes a specific chat and all its associated messages. Requires a valid session cookie.

## Notes For Development

- The app currently assumes cookie-based authentication and cross-origin requests, so the backend CORS config must stay aligned with the frontend origin.
- The frontend login and register pages navigate immediately after submit; if you want stricter success handling, check the API response before redirecting.
- The chat experience relies on a Socket.IO connection, which is established when the dashboard loads.

## Next Useful Improvements

- Add a `.env.example` file for both frontend and backend configuration.
- Make the backend and frontend base URLs configurable through environment variables.
- Add loading and error messages directly in the auth screens.
- Protect the dashboard route with an authenticated route guard.
- Allow users to rename existing chats.
- Refactor UI components for better reusability and separation of concerns.

## Dashboard UI Enhancements (Interview Deep Dive)

Recently, 5 key features were implemented to enhance the Dashboard's user experience and functionality. Here is a detailed breakdown of how each feature works, designed to help understand the flow for technical interviews:

### 1. User Icon & Profile Display
**What it is:** A profile section at the bottom of the sidebar showing the logged-in user's name and icon.
**How it works:**
- **State Selection:** Uses Redux `useSelector` to pull the `user` object from `state.auth`.
- **UI:** Renders a clean flex container at the bottom of the `<aside>` component in `DashBoard.jsx`. It conditionally renders the `user.username` and provides a fallback (e.g., 'User') if it's missing.
- **Why it matters:** Confirms the active session visually without requiring the user to navigate to a separate profile page.

### 2. Secure Logout Flow
**What it is:** A logout button that clears the session both on the client and server.
**How it works:**
- **Backend (`auth.controller.js`):** A `GET /api/auth/logout` endpoint was created. It executes `res.clearCookie("token")` to securely invalidate the JWT session cookie.
- **Frontend API (`auth.api.js`):** Makes the request to the logout endpoint.
- **Redux State (`auth.slice.js`):** A `logoutUser` reducer sets the `state.user` back to `null`.
- **Custom Hook (`use.auth.js`):** The `handleLogout` function orchestrates the flow: sets loading to true, awaits the API call, dispatches the Redux action, and handles errors.
- **Why it matters:** Essential for security. Relying solely on client-side state clearance leaves the JWT cookie active, which could lead to CSRF or session hijacking. Clearing the HttpOnly cookie is the correct approach.

### 3. Delete Chat Functionality
**What it is:** A trash icon next to each chat in the sidebar that permanently deletes the conversation.
**How it works:**
- **Backend:** `DELETE /api/chats/delete/:chatId` removes the chat document and cascades deletion to all associated messages in MongoDB.
- **Frontend Hook (`useChat.js`):** `handleDeleteChat(chatId)` wraps the API call (`deleteChat`) and upon success, dispatches `removeChat`.
- **Redux Reducer (`chat.slice.js`):** The `removeChat` reducer deletes the specific chat ID from `state.chats`. Crucially, if `state.currentChatId === chatId`, it resets `currentChatId` to `null` to clear the main screen.
- **UI:** A `group-hover` utility from Tailwind CSS is used so the delete icon only appears when the user hovers over a chat item, keeping the sidebar uncluttered.
- **Why it matters:** Gives users control over their data footprint. Handled optimistically or via Redux sync to instantly remove the chat from the UI without requiring a full page refresh.

### 4. Preloaded Chat Suggestions (Empty State)
**What it is:** A set of prompt suggestions displayed when there are no messages in the current chat or no chat selected.
**How it works:**
- **Condition:** Checks `(!chats[currentChatId] || chats[currentChatId].messages.length === 0)` and `!isLoading`.
- **Data:** An array of string prompts (`const suggestions = [...]`).
- **Interaction:** Clicking a suggestion triggers `handleSuggestionClick(suggestion)` which directly calls `chat.handleSendMessage(...)`.
- **Why it matters:** Eliminates the "blank page syndrome" and guides new users on how to interact with the AI model. It improves onboarding engagement.

### 5. AI Streaming / Loading Animation
**What it is:** A visual indicator (bouncing dots) showing that the AI is processing the request.
**How it works:**
- **State Integration:** The `isLoading` flag from `state.chat.isLoading` is mapped via `useSelector`.
- **UI Implementation:** When `isLoading` is true, an additional message bubble is rendered at the bottom of the chat list. It uses Tailwind's `animate-bounce` on three small `div` circles.
- **Animation Sync:** Inline styles (`style={{ animationDelay: '...' }}`) are used to stagger the bounce effect (0ms, 150ms, 300ms), creating a wave-like typing indicator.
- **Why it matters:** Provides immediate visual feedback after a user submits a prompt, preventing them from wondering if the app froze or the click registered. Essential for asynchronous LLM operations which can take several seconds to stream.
