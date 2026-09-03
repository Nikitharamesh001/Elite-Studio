import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAhLNE8e9VAWFtwTVe4qeoOQWCICYfLmvc",
    authDomain: "elite-studio-5f2af.firebaseapp.com",
    projectId: "elite-studio-5f2af",
    storageBucket: "elite-studio-5f2af.firebasestorage.app",
    messagingSenderId: "674846478953",
    appId: "1:674846478953:web:f36aa9228e7cab0077c8f8",
    measurementId: "G-FZS52VRZJX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);