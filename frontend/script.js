// ../frontend/script.js

import { ref, off, query, limitToLast, onChildAdded, push, set } from 'firebase/database';

// Prevent initChat from wiring up twice
let chatStarted = false;
/**
 * Initializes the chat UI and synchronizes with Firebase Realtime Database.
 * @param {import('firebase/auth').User} user - Currently authenticated user
 * @param {import('firebase/database').Database} db - Firebase Realtime Database instance
 */
export function initChat(user, db) {
  if (chatStarted) return;   // ← bail out if already initialized
  chatStarted = true;

  const chatWindow = document.getElementById('chat-window');
  const input      = document.getElementById('input');
  const sendBtn    = document.getElementById('send');

  // Append a message to the chat window
  function appendMessage(text, cls) {
    const msg = document.createElement('div');
    msg.className = `message ${cls}`;
    msg.textContent = text;
    chatWindow.append(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  const rawRef = ref(db, `chats/${user.uid}/messages`);
    off(rawRef);                             // ← remove all old listeners on this path
    const msgsRef = query(rawRef, limitToLast(50));

  // 2. Handle sending of new messages
  sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    // Save user message
    const userMsgRef = push(ref(db, `chats/${user.uid}/messages`));
    await set(userMsgRef, { sender: 'user', text, timestamp: Date.now() });
    appendMessage(text, 'user');
    input.value = '';

    try {
      // Send to backend for bot reply
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, uid: user.uid })
      });
      const { reply } = await res.json();

      // Save bot reply
      const botMsgRef = push(ref(db, `chats/${user.uid}/messages`));
      await set(botMsgRef, { sender: 'bot', text: reply, timestamp: Date.now() });
      appendMessage(reply, 'bot');
    } catch (err) {
      appendMessage('Error: could not reach server.', 'bot');
    }
  };
}
