
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjTrNv52OnvpVwKZ6CkON_WBfcKGGdtr0",
  authDomain: "react-project-d73a0.firebaseapp.com",
  projectId: "react-project-d73a0",
  storageBucket: "react-project-d73a0.appspot.com", // ✅ fixed here
  messagingSenderId: "571707793519",
  appId: "1:571707793519:web:9709977359875a1410ad9a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
