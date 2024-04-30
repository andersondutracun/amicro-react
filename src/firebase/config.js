import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importe o módulo de autenticação do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyBi4ldTDlZM79um3Hk7GPDvq1JOacgbhY4",
  authDomain: "amicro-c990e.firebaseapp.com",
  projectId: "amicro-c990e",
  storageBucket: "amicro-c990e.appspot.com",
  messagingSenderId: "629028184962",
  appId: "1:629028184962:web:05ed90daea58a9834fa59b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicialize o módulo de autenticação

export { db, auth }; // Exporte o módulo de autenticação também