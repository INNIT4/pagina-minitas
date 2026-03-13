// REEMPLAZA estos valores con los de tu proyecto en Firebase Console
// https://console.firebase.google.com/
// NO versiones este archivo con credenciales reales en repos públicos

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyC8SO1SLp1wuCk8pZgfEKa4Toug3S70ge4",
  authDomain:        "salon-primavera.firebaseapp.com",
  projectId:         "salon-primavera",
  storageBucket:     "salon-primavera.firebasestorage.app",
  messagingSenderId: "760503237674",
  appId:             "1:760503237674:web:54e9434e312ec8a769d753",
  measurementId:     "G-793SXNT77N"
};

// Firebase se inicializa solo si hay credenciales reales
let app, auth, db, storage;

const isConfigured = !firebaseConfig.apiKey.startsWith("REEMPLAZA");

if (isConfigured) {
  app     = initializeApp(firebaseConfig);
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage, isConfigured };
