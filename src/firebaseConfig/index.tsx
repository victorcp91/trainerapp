import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXAwQbtppmwwYi6GxHj3ai3oG2vXTGt0E",
  authDomain: "trainerapp-d0459.firebaseapp.com",
  projectId: "trainerapp-d0459",
  storageBucket: "trainerapp-d0459.firebasestorage.app",
  messagingSenderId: "809760639154",
  appId: "1:809760639154:web:1bf2f60c31e0d560e6a1ab",
  measurementId: "G-9F110542QT",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
