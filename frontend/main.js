// frontend/app.js
import { initializeApp }     from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase }       from 'firebase/database';
import { firebaseConfig }    from './firebase-config.js';
import { initChat, newSession } from './chat.js';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

// when the user logs in, initialize chat
const unsubscribe = onAuthStateChanged(auth, user => {
    if (user) {
        initChat(user, db);
        unsubscribe();
    } else {
        window.location.href = 'login.html';
    }
});

// wire up logout
document.getElementById('logout').onclick = async () => {
    await signOut(auth);
    window.location.href = 'login.html';
};

// wire up “New Chat”
document.getElementById('new-chat').onclick = () => {
    newSession(auth.currentUser.uid, db);
};
