// REEMPLAZA estos valores con los de tu proyecto en Firebase Console
// https://console.firebase.google.com/
// NO versiones este archivo con credenciales reales en repos públicos

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "REEMPLAZA_API_KEY",
  authDomain:        "REEMPLAZA_AUTH_DOMAIN",
  projectId:         "REEMPLAZA_PROJECT_ID",
  storageBucket:     "REEMPLAZA_STORAGE_BUCKET",
  messagingSenderId: "REEMPLAZA_SENDER_ID",
  appId:             "REEMPLAZA_APP_ID"
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
