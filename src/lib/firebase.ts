// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXsTEsJYlokNr4XaF6Apdeqw9iLxf9BnU",
  authDomain: "spaces-a854a.firebaseapp.com",
  projectId: "spaces-a854a",
  storageBucket: "spaces-a854a.appspot.com",
  messagingSenderId: "402430332609",
  appId: "1:402430332609:web:d525c27772cdc665fb4e40",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
