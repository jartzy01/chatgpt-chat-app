// frontend/signup.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set }   from 'firebase/database';
import { firebaseConfig }          from './firebase-config.js';

// -- Initialize --
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

// -- Signup form handler --
document.getElementById('signup-form')
    .addEventListener('submit', async e => {
        e.preventDefault();
        const name     = e.target.displayName.value.trim();
        const email    = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            // 1. Create user in Firebase Auth
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Give them a displayName in their profile
            await updateProfile(user, { displayName: name });

            // 3. Write additional profile info into Realtime DB
            await set(ref(db, `users/${user.uid}`), {
                displayName: name,
                email: user.email,
                createdAt:   Date.now()
        });

        // 4. Redirect into your app (e.g. your chat page)
            window.location.href = 'index.html';
        }
        catch (err) {
            console.error('Signup error', err);
            alert(err.message);
        }
    });
