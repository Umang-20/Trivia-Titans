import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXmhjD2otVqylIfW5CYQQgg7jJOOHIa20",
  authDomain: "csci5410-cd222.firebaseapp.com",
  projectId: "csci5410-cd222",
  storageBucket: "csci5410-cd222.appspot.com",
  messagingSenderId: "572321449143",
  appId: "1:572321449143:web:f2ee80f5e36b15c8adf932",
  measurementId: "G-QH99SS8LQR",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider };
