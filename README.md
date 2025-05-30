# ChatGPT Chat & Automation App

A web-based chat application powered by ChatGPT and Firebase, with built-in Robotic Process Automation (RPA) capabilities using PyAutoGUI and Selenium. Users can authenticate, chat with AI in real-time, generate automation scripts in natural language, and execute them locally.

## Architecture

This monorepo contains:

* **backend**: Node.js Express server for ChatGPT proxy
* **gateway**: HTTP proxy for unified ports and CORS
* **frontend**: Parcel-based web client with Firebase Auth & chat UI
* **automation\_bridge**: Python Flask service to interpret commands and generate automation code via OpenAI
* **automation\_server**: Python Flask service to execute generated automation scripts on your machine
* Root-level configs: `package.json`, `requirements.txt`, `.env`, `README.md`

## Features

* **User Authentication** via Firebase (email/password)
* **Real-time Chat** with messages stored in Firebase Realtime Database
* **AI Responses** powered by OpenAI's ChatGPT API
* **Automation Commands** (`/pyautogui`, `/selenium`) to generate and run scripts
* **Local Script Execution** with PyAutoGUI and Selenium WebDriver
* **Unified Access** through a single gateway on `http://localhost:8081`

## Prerequisites

* Node.js 16+ & npm
* Python 3.10+ & pip
* A Firebase project (for Auth & Realtime Database)
* Chrome or Firefox (for Selenium)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/chatgpt-chat-app.git
   cd chatgpt-chat-app
   ```

2. **Environment Configuration**

   * Copy `.env.example` to `.env` and set:

     ```env
     OPENAI_API_KEY=your-openai-api-key
     FRONTEND_PORT=1234
     CHAT_PORT=3001
     AUTO_PORT=5002
     GATEWAY_PORT=8081
     ```
   * Update `frontend/firebase-config.js` with your Firebase credentials.

3. **Install dependencies**

   ```bash
   npm install
   pip install -r requirements.txt
   ```

4. **Run Services**

   * **Automation Executor**

     ```bash
     python automation_server.py
     ```
   * **Automation Bridge**

     ```bash
     python automation_bridge.py
     ```
   * **Node Workspace**

     ```bash
     npm run dev
     ```

5. **Open the app** in your browser:

   ```text
   http://localhost:8081
   ```

## Usage

* Send chat messages to interact with AI
* Use commands:

  * `/pyautogui <instruction>` to generate PyAutoGUI scripts
  * `/selenium <instruction>` to generate Selenium scripts
* View script generation and execution results in the chat window

## Folder Structure

```bash
.
├── backend
├── gateway
├── frontend
├── automation_bridge
├── automation_server
├── package.json
├── requirements.txt
└── README.md
```
