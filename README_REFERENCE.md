# Axion AI - Annotated Code Reference

## File Reference Table

| File Path | Purpose | Key Exports |
|---|---|---|
| `backend/src/app.js` | Express app configuration | `app` |
| `backend/server.js` | Application entry point | N/A |
| `backend/src/services/ai.service.js` | Langchain LLM orchestrator | `generateResponse`, `generateChatTitle` |
| `backend/src/controllers/auth.controller.js` | Authentication handlers | `register`, `login`, `verifyEmail`, `getMe`, `logout` |
| `backend/src/routes/auth.router.js` | Auth API endpoints | `authRouter` |
| `frontend/src/features/chat/pages/DashBoard.jsx` | Main Chat UI Page | `DashBoard` |

## Exported Functions Details

### `backend/src/services/ai.service.js`

#### `generateResponse(messages)`
- **Signature:** `async generateResponse(messages: Array) -> String`
- **Parameters:** `messages` - Array of message objects `{ role, content }`.
- **Returns:** AI response string.
- **Description:** Invokes a Langchain ReAct agent using Gemini, with access to a Tavily internet search tool. Maps simple user/ai roles to LangChain message classes.
- **Example Usage:**
  ```javascript
  const response = await generateResponse([{ role: "user", content: "Hello" }]);
  ```

#### `generateChatTitle(message)`
- **Signature:** `async generateChatTitle(message: String) -> String`
- **Parameters:** `message` - The first user message.
- **Returns:** A short chat title string.
- **Description:** Uses Mistral (if configured) to generate a concise title. Falls back to Gemini, and then to a simple string slicing strategy if APIs fail.

### `backend/src/controllers/auth.controller.js`

#### `register(req, res)`
- **Signature:** `async register(req, res) -> void`
- **Parameters:** standard Express `req` and `res`.
- **Description:** Checks if user exists. Creates user, generates JWT verification token, and sends welcome email.

#### `login(req, res)`
- **Signature:** `async login(req, res) -> void`
- **Parameters:** standard Express `req` and `res`.
- **Description:** Validates credentials. Emits a `token` via an `httpOnly` cookie valid for 7 days.

### `frontend/src/features/chat/pages/DashBoard.jsx`

#### `DashBoard()`
- **Signature:** `DashBoard() -> JSX.Element`
- **Description:** The primary chat interface component. Manages responsive sidebar state, lists past chats, and renders the conversation using `react-markdown` with syntax highlighting for code blocks.
- **Side effects:** Connects to sockets on mount, listens for window resize events.
