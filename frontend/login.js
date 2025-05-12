// login.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set
} from 'firebase/database';
import { firebaseConfig } from './firebase-config.js';

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const database = getDatabase(app);

// redirect if already signed in
onAuthStateChanged(auth, user => {
  if (user) window.location.href = 'chat.html';
});

// login
document.getElementById('login-form')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const email    = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will catch it and redirect
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  });



