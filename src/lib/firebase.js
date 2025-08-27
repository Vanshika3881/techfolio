import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyD5dwpYjzcoIZC5kA0n9jiLq-z07XRnMcg",
  authDomain: "techfolio-cac80.firebaseapp.com",
  projectId: "techfolio-cac80",
  storageBucket: "techfolio-cac80.firebasestorage.app",
  messagingSenderId: "446988931070",
  appId: "1:446988931070:web:23a6bb4235a1a20bbefaaf",
  measurementId: "G-MHT8FC8L8J"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);