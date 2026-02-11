import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjNvCDgip9k2M7WrjGkwQUrSPVs2chWRU",
  authDomain: "follow-the-crypto-33160.firebaseapp.com",
  projectId: "follow-the-crypto-33160",
  storageBucket: "follow-the-crypto-33160.appspot.com",
  messagingSenderId: "752359901039",
  appId: "1:752359901039:web:f354df89549995e5488a9a",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "follow-the-crypto-2026");
export const auth = getAuth(app);
