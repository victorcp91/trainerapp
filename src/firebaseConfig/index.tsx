import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "trainerapp-d0459",
  storageBucket: "trainerapp-d0459.firebasestorage.app",
  messagingSenderId: "809760639154",
  appId: "1:809760639154:web:1bf2f60c31e0d560e6a1ab",
  measurementId: "G-9F110542QT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
