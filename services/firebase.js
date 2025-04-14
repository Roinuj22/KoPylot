

// Depuis firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxB5X0p87caoMb29vvnsrBF-_p0Qybh10",
  authDomain: "kopylot-3c936.firebaseapp.com",
  projectId: "kopylot-3c936",
  storageBucket: "kopylot-3c936.firebasestorage.app",
  messagingSenderId: "392361933726",
  appId: "1:392361933726:web:15cfece258ecf1be16f48f",
  measurementId: "G-WWPGBDHXEW"
};


const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);