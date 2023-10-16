// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlQ9Wppw3FVS1qTTt868kjcfH_aB3nGaQ",
  authDomain: "fir-react-ebf21.firebaseapp.com",
  projectId: "fir-react-ebf21",
  storageBucket: "fir-react-ebf21.appspot.com",
  messagingSenderId: "770839531615",
  appId: "1:770839531615:web:d46cd3b4c9b65097da4bea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);