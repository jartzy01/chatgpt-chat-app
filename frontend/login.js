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
  if (user) window.location.href = 'index.html';
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

// switch to signup
const showSignup = document.getElementById('show-signup');
showSignup.addEventListener('click', e => {
  e.preventDefault();
  const form = document.getElementById('login-form');
  form.innerHTML = `
    <input type="email"    name="email"    placeholder="Email"    required />
    <input type="password" name="password" placeholder="Password" required />
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
      email:     userCred.user.email,
      createdAt: Date.now()
    });
    // now redirect
    window.location.href = 'index.html';
  } catch (err) {
    alert('Signup error: ' + err.message);
  }
}
