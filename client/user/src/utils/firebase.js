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
  apiKey: "AIzaSyC5yw8DXx7JyAH1PC8bwTHyCl4K6S_Jdss",
  authDomain: "eventrix-36302.firebaseapp.com",
  projectId: "eventrix-36302",
  storageBucket: "eventrix-36302.firebasestorage.app",
  messagingSenderId: "1096540170064",
  appId: "1:1096540170064:web:4b5bfdf5acf2e0fb7dae55",
  measurementId: "G-08JW5FN0JT"
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
