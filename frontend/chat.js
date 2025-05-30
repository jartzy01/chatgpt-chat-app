// frontend/chat.js
import { ref, off, query, limitToLast, onChildAdded, push, set } from 'firebase/database';

let chatStarted = false;
let sessionId   = null;

/**
 * Call this to spin up—or switch to—a fresh session.
 */
export async function newSession(uid, db) {
  // 1) create session record
  const sessRef = push(ref(db, `chats/${uid}/sessions`));
  sessionId = sessRef.key;

  // 2) set metadata
  await set(ref(db, `chats/${uid}/sessions/${sessionId}/meta`), {
    createdAt: Date.now(),
    title:   `Chat at ${new Date().toLocaleTimeString()}`
  });

  // 3) save & clear UI
  localStorage.setItem('sessionId', sessionId);
  document.getElementById('chat-window').innerHTML = '';
  return sessionId;
}

/**
 * Initializes the chat UI & database listeners.
 */
export async function initChat(user, db) {
  if (chatStarted) return;
  chatStarted = true;

  const uid        = user.uid;
  const chatWindow = document.getElementById('chat-window');
  const input      = document.getElementById('input');
  const sendBtn    = document.getElementById('send');

  // helper to subscribe to the current session
  let rawRef = null;
function bindSession(sid) {
  // clear the UI and old listener
  chatWindow.innerHTML = '';
  if (rawRef) off(rawRef);

  // new path & listeners
  sessionId = sid;
  rawRef = ref(db, `chats/${uid}/sessions/${sessionId}/messages`);
  const msgsRef = query(rawRef, limitToLast(100));
  onChildAdded(msgsRef, snap => {
    const { sender, text } = snap.val();
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
}

  // 1) load whichever session was last open
  let sid = localStorage.getItem('sessionId');
  if (!sid) sid = await newSession(uid, db); // create a new session
  bindSession(sid); // bind to the session
  // 2) listen for session changes
  window.addEventListener('storage', e => {
    if (e.key === 'sessionId') {
      bindSession(e.newValue); // bind to the new session
    }
  });

  // sending new messages
  sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;
  
    // push user message
    const userRef = push(rawRef);
    await set(userRef, { sender: 'user', text, timestamp: Date.now() });
    input.value = '';
  
    let reply = '';
  
    // NEW: Handle /auto messages
    if (text.startsWith("/pyautogui") || text.startsWith("/selenium")) {
      const bridgeRes = await fetch('http://localhost:5002/interpret-and-execute', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text })
      });
      const { generate_code } = await bridgeRes.json();

      // now send that code to the executor
      await fetch('http://localhost:5001/execute-automation', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ code: generate_code, type: 'pyautogui' })
      });

      reply = generate_code;
    } else {
      const res = await fetch('http://localhost:8081/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, uid })
      });
      if (!res.ok) {
        console.error('AI error', await res.text());
        reply = '🤖 Sorry, something went wrong.';
      } else {
        const { reply: aiReply } = await res.json();
        reply = aiReply;
      }
    }
  
    // push bot reply
    const botRef = push(rawRef);
    await set(botRef, { sender: 'bot', text: reply, timestamp: Date.now() });
  };
}
