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

// Initialize Firebase
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const database = getDatabase(app);

// Redirect if already signed in
onAuthStateChanged(auth, user => {
  if (user) window.location.href = 'index.html';
});

// Login handler
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email    = e.target.email.value;
  const password = e.target.password.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert('Login error: ' + err.message);
  }
});

// Switch to sign-up form…
const showSignup = document.getElementById('show-signup');
showSignup.addEventListener('click', e => {
  e.preventDefault();
  const form = document.getElementById('login-form');
  form.innerHTML = `
    <input type="email"    id="email"    placeholder="Email"    required />
    <input type="password" id="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  `;
  form.onsubmit = signupHandler;
});

async function signupHandler(e) {
  e.preventDefault();
  const email    = e.target.email.value;
  const password = e.target.password.value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(database, 'users/' + userCred.user.uid), {
      email: userCred.user.email,
      createdAt: Date.now()
    });
    window.location.href = 'index.html';
  } catch (err) {
    alert('Signup error: ' + err.message);
  }
}
