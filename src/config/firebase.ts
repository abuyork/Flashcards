import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQDBjIxhXCIPBgCtnag48NV91U-MCuHZc",
  authDomain: "flashcard-4813f.firebaseapp.com",
  projectId: "flashcard-4813f",
  storageBucket: "flashcard-4813f.firebasestorage.app",
  messagingSenderId: "1087409979978",
  appId: "1:1087409979978:web:471ccbd8d833e4293c5cb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore
export const db = getFirestore(app);