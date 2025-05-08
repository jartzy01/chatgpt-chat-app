# ChatGPT Chat App

A simple chat application powered by OpenAI's ChatGPT API, built with a Node.js/Express backend and a static frontend. This project demonstrates how to separate concerns into `backend/` and `frontend/` folders, and how to connect them locally (or in production) for a seamless chat experience.

---

## Table of Contents

* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)

  * [Clone the Repo](#clone-the-repo)
  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [Running the App](#running-the-app)

  * [Development (Live Reload)](#development-live-reload)
  * [Production](#production)
* [Configuration](#configuration)
* [Scripts](#scripts)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## Project Structure

```text
chatgpt-chat-app/
├── backend/               # Node.js + Express server
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies & scripts
│   └── server.js          # Express server and OpenAI integration
├── frontend/              # Static frontend
│   ├── index.html         # Chat UI
│   ├── styles.css         # Basic styles
│   └── script.js          # Client-side logic
├── .gitignore             # Ignored files (node_modules, .env, etc.)
└── README.md              # This file
```

---

## Prerequisites

* [Node.js](https://nodejs.org/) v14 or above
* [npm](https://www.npmjs.com/) (comes with Node.js)
* An OpenAI API key (sign up at [https://platform.openai.com](https://platform.openai.com))

---

## Getting Started

### Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/chatgpt-chat-app.git
cd chatgpt-chat-app
```

### Backend Setup

1. Navigate into the backend folder:

   ```bash
   cd backend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file:

   ```bash
   touch .env
   ```
4. Add your OpenAI key and port in `.env`:

   ```dotenv
   OPENAI_API_KEY=sk-REPLACE_ME
   PORT=3001
   ```
5. (Optional) Add ES module support in `package.json` if you see warnings:

   ```json
   {
     "name": "backend",
     "version": "1.0.0",
     "type": "module",
     // ...
   }
   ```

### Frontend Setup

No dependencies to install—this is just static HTML, CSS, and JavaScript. You can open `frontend/index.html` directly or serve it with a static server:

```bash
npx serve frontend
```

---

## Running the App

### Development (Live Reload)

1. **Backend** (with auto-restart):

   ```bash
   cd backend
   npm run dev   # uses nodemon
   ```

2. **Frontend** (with live reload):

   ```bash
   bash
   cd frontend
   npm run dev
   ```

3. Open your browser at `http://localhost:5500`, type a message, and see the chat powered by `http://localhost:3001/chat`.

### Production

1. Build or bundle the frontend however you prefer (e.g., with Webpack, Parcel, or a framework).
2. Serve the static assets from any web server (Vercel, Netlify, Nginx, etc.)
3. Deploy the backend to a Node.js host (Heroku, DigitalOcean, AWS).
4. Update the fetch URL in `script.js` to point to your deployed backend endpoint.

---

## Configuration

| Variable         | Description                          | Example   |
| ---------------- | ------------------------------------ | --------- |
| `OPENAI_API_KEY` | Your OpenAI API key                  | `sk-xxxx` |
| `PORT`           | Port for Express server to listen on | `3001`    |

---

## Scripts

### Backend (within `/backend`)

| Command       | Description                      |
| ------------- | -------------------------------- |
| `npm start`   | Run server once                  |
| `npm run dev` | Run with nodemon (auto-restarts) |

### Root (optional)

If you added a root `package.json` with `concurrently`:

| Command       | Description                 |
| ------------- | --------------------------- |
| `npm run dev` | Run both backend & frontend |

---

## Deployment

* **Backend**: Deploy your `backend/` folder to any Node.js–capable host. Ensure environment variables are set.
* **Frontend**: Host static files on any CDN or static host. Update the API URL in `script.js` to your backend’s public URL.

---

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push to your branch (`git push origin feat/my-feature`)
5. Open a Pull Request

Please follow conventional commits and write clear, concise PR descriptions.

---

## License

This project is licensed under the [MIT License](LICENSE).
