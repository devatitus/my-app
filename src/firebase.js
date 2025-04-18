import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Added storage import

const firebaseConfig = {
  apiKey: "AIzaSyDZFXYK1uJmyZSCNV3vk1HfnWWacb0vLb8",
  authDomain: "my-menu-5c0da.firebaseapp.com",
  projectId: "my-menu-5c0da",
  storageBucket: "my-menu-5c0da.appspot.com", // Corrected storage bucket
  messagingSenderId: "703941949024",
  appId: "1:703941949024:web:99fc1df3798b0bb9c63505"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Added storage

export { auth, db, storage };
