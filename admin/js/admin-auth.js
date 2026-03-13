import { auth } from '../../js/firebase-config.js';

export function initAuth(onLogin, onLogout) {
  import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js")
    .then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (user) => {
        if (user) onLogin(user);
        else onLogout();
      });
    });
}

export async function loginWithEmail(email, password) {
  const { signInWithEmailAndPassword } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const { signOut } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
  return signOut(auth);
}

export function translateAuthError(code) {
  const map = {
    'auth/invalid-email':         'Correo inválido.',
    'auth/user-not-found':        'Usuario no encontrado.',
    'auth/wrong-password':        'Contraseña incorrecta.',
    'auth/invalid-credential':    'Correo o contraseña incorrectos.',
    'auth/too-many-requests':     'Demasiados intentos. Intenta más tarde.',
    'auth/network-request-failed':'Error de red. Verifica tu conexión.',
    'auth/unauthorized-domain':   'Este dominio no está autorizado. Revisa Firebase Console.'
  };
  return map[code] || 'Error al iniciar sesión. Intenta de nuevo.';
}
