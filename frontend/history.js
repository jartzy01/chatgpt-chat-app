import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebaseConfig } from './firebase-config.js';

const app        = initializeApp(firebaseConfig);
const auth       = getAuth(app);
const db         = getDatabase(app);
const sessListEl = document.getElementById('session-list');
const histListEl = document.getElementById('history-list');

onAuthStateChanged(auth, user => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    const uid = user.uid;

    // 1) Render session buttons
    const sessionsRef = ref(db, `chats/${uid}/sessions`);
    onValue(sessionsRef, snap => {
        sessListEl.innerHTML = '';
        snap.forEach(child => {
        const sid  = child.key;                            // ← use .key
        const meta = child.child('meta').val() || {};
        const title = meta.title || new Date(meta.createdAt).toLocaleString();

        const btn = document.createElement('button');
        btn.textContent = title;
        btn.onclick = () => loadSession(uid, sid);        // ← lowercase onclick
        if (sid === localStorage.getItem('sessionId')) {
            btn.style.fontWeight = 'bold';
        }
        sessListEl.appendChild(btn);
        });
    });

    // 2) Load whichever session was last open
    const startSid = localStorage.getItem('sessionId');
    if (startSid) loadSession(uid, startSid);
});

function loadSession(uid, sid) {
    localStorage.setItem('sessionId', sid);
    histListEl.innerHTML = '';

    const msgsRef = ref(db, `chats/${uid}/sessions/${sid}/messages`);
    onValue(msgsRef, snap => {
        const msgs = [];
        snap.forEach(c => msgs.push(c.val()));
        msgs.sort((a, b) => a.timestamp - b.timestamp);

        histListEl.innerHTML = '';
        msgs.forEach(msg => {
        const li = document.createElement('li');
        li.className   = msg.sender;                      // ← use msg.sender
        li.textContent = msg.text;                        // ← use msg.text
        histListEl.appendChild(li);
        });
    });
}
