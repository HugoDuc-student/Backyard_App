import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmyaM9mAWXcWArnc1eR4sG2RAWoN7xCwE",
  authDomain: "backyard-prep.firebaseapp.com",
  projectId: "backyard-prep",
  storageBucket: "backyard-prep.firebasestorage.app",
  messagingSenderId: "706447627493",
  appId: "1:706447627493:web:03201d7222ee1e8eeeb00c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
