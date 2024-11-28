import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YAIzaSyDKdfKiQSxsQXzek2zwqE5Aj0HKekYq-Do",
  authDomain: "notetaker-7e62f.firebaseapp.com",
  projectId: "notetaker-7e62f",
  storageBucket: "notetaker-7e62f.firebasestorage.app",
  messagingSenderId: "758026177635",
  appId: "Y1:758026177635:web:c1d8f215095d497c15bc56",
   measurementId: "G-RQGJLQ7S61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
export const db = getFirestore(app);

