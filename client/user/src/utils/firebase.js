import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjRVoRq1tdYNWkjD6wbu5m1VFLutJ9UpY",
  authDomain: "event-622e4.firebaseapp.com",
  projectId: "event-622e4",
  storageBucket: "event-622e4.firebasestorage.app",
  messagingSenderId: "545526115866",
  appId: "1:545526115866:web:bd3635fbb41d4cf7d86ba3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
};
