// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbRcPjnQq7eLTFD_a4ZG1vzPFmn9iAi1Q",
  authDomain: "somni-179cf.firebaseapp.com",
  projectId: "somni-179cf",
  storageBucket: "somni-179cf.firebasestorage.app",
  messagingSenderId: "829776509817",
  appId: "1:829776509817:web:e6a6614359b2647c570da8",
  measurementId: "G-4TRJLP7VRS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const analytics = getAnalytics(app);

export { auth, db };
