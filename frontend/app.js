// ../frontend/app.js

import { initializeApp }     from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase }       from 'firebase/database';
import { firebaseConfig }    from './firebase-config.js';
import { initChat }          from './script.js';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

const unsubscribe = onAuthStateChanged(auth, user => {
    if (user) {
        initChat(user, db);
        unsubscribe(); // Unsubscribe to avoid multiple listeners
    } else {
        window.location.href = 'login.html';
    }
});

const logoutBtn = document.getElementById('logout');
logoutBtn.onclick = async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html';
    } catch (err) {
        console.error('Logout error:', err);
    }
};