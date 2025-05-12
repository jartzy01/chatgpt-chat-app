# ChatGPT Chat App

A real-time chat application powered by Firebase (Auth + Realtime Database) on the frontend and OpenAI’s ChatGPT on the backend. It’s organized as an npm workspace monorepo with three services:

1. **backend** – Express server that proxies chat messages to OpenAI  
2. **gateway** – Lightweight HTTP proxy to unify ports and handle CORS  
3. **frontend** – Parcel-bundled HTML/JS app with Firebase authentication and chat UI  

---

## Features

- **User auth** (email/password) via Firebase Auth  
- **Chat sessions** stored and streamed in Firebase Realtime Database  
- **AI responses** from OpenAI’s ChatGPT API  
- **Monorepo** setup using npm workspaces for unified scripts  

---

## Prerequisites

- **Node.js** ≥ 16.x (npm ≥ 7 for workspace support)  
- An **OpenAI API key**  
- A **Firebase project** (Auth + Realtime Database enabled)  

---

## Installation

1. **Clone this repo**  
   ```bash
   git clone https://github.com/jartzy01/chatgpt-chat-app.git
   cd chatgpt-chat-app

    Install dependencies

    npm install

Configuration
1. Backend

Create a .env file in backend/:

OPENAI_API_KEY=your_openai_api_key_here
PORT=3001           # optional; defaults to 3001

2. Gateway

By default it proxies:

    Frontend → http://localhost:1234

    Backend → http://localhost:3001

    Exposes gateway on http://localhost:8081

To override, create gateway/.env:

FRONTEND_PORT=1234
BACKEND_PORT=3001
GATEWAY_PORT=8081

3. Frontend

In frontend/firebase-config.js, replace the sample config with your Firebase project settings:

export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};

Running Locally

You can start each service individually or all at once:
All services concurrently

npm run dev

This will launch:

    Backend on http://localhost:3001

    Frontend dev server on http://localhost:1234

    Gateway on http://localhost:8081 (point your browser here)

Or separately

npm run start:backend   # starts Express + OpenAI
npm run start:gateway   # starts HTTP proxy
npm run start:frontend  # starts Parcel dev server

Building for Production

    Build the frontend

    npm run build:frontend

    Assets will be in frontend/dist/.

    Deploy

        Serve frontend/dist/ from your static host.

        Run the backend & gateway on your server/VM.

        Update the proxy targets in gateway/.env to your public URLs.

Project Structure

chatgpt-chat-app/
├── backend/
│   ├── server.js          # Express + OpenAI handler
│   ├── .env               # OpenAI key, port
│   └── package.json
├── gateway/
│   ├── proxy.js           # HTTP proxy server
│   └── package.json
├── frontend/
│   ├── chat.html          # Main chat UI
│   ├── login.html         # Login form
│   ├── signup.html        # Signup form
│   ├── main.js            # Firebase init & auth wiring
│   ├── chat.js            # Chat session logic
│   ├── login.js, signup.js
│   ├── firebase-config.js # Firebase SDK config
│   ├── styles.css
│   └── package.json
├── package.json           # Root workspace config
└── .gitignore

Contributing

    Fork the repo

    Create a feature branch

    Commit and push

    Open a PR
