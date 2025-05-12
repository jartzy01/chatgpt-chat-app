# ChatGPT Chat App

A full-stack chat application powered by OpenAI's ChatGPT API. This project features user authentication and chat history storage using Firebase, alongside a conversational interface built with HTML, CSS, and JavaScript.

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)

  * [Clone the Repository](#clone-the-repository)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [Running Locally](#running-locally)
* [Building for Production](#building-for-production)
* [Usage](#usage)
* [Scripts](#scripts)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Express.js backend** integrating with OpenAI's ChatGPT API
* **Firebase Authentication** for user signup and login
* **Firebase Realtime Database** for storing chat history
* **Lightweight frontend** using HTML, CSS, and vanilla JavaScript
* **Parcel bundler** for easy development and production builds
* **CORS enabled** for local development

---

## Project Structure

```
chatgpt-chat-app/
├── backend/            # Express.js server
├── frontend/           # Client-side application
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

---

## Prerequisites

* **Node.js** v16 or higher
* **npm** v8 or higher
* An **OpenAI API Key** (set as `OPENAI_API_KEY`)
* A **Firebase project** with Web app credentials

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/chatgpt-chat-app.git
cd chatgpt-chat-app
```

### Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with the following content:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001           # optional, default is 3001
   ```

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd ../frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Update `firebase-config.js` with your Firebase Web app credentials:

   ```js
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

---

## Running Locally

### Backend

```bash
cd backend
npm run dev
```

* Runs the server on `http://localhost:3001`

### Frontend

```bash
cd frontend
npm run dev
```

* Serves the client on `http://localhost:1234` (opens `login.html` by default)

---

## Building for Production

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the contents of `frontend/dist` to your static hosting provider.
3. Ensure your backend CORS settings include the production frontend origin.

---

## Usage

1. Open the app in your browser (`login.html`).
2. Sign up or log in with your Firebase credentials.
3. Use the chat interface to send messages to ChatGPT.
4. View past conversations in `history.html`.

---

## Scripts

### Backend (in `backend/`)

* `npm run start` — Start server
* `npm run dev` — Start server with nodemon

### Frontend (in `frontend/`)

* `npm run dev` — Serve files for development
* `npm run build` — Build for production

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/YourFeature`)
3. Commit your changes (`git commit -m "feat: add awesome feature"`)
4. Push to your branch (`git push origin feat/YourFeature`)
5. Open a pull request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and provide clear PR descriptions.

---

## License

This project is licensed under the [MIT License](LICENSE).
