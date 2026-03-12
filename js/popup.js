import { db, isConfigured } from './firebase-config.js';

export async function initPopup() {
  if (!isConfigured) return;

  // Guard: solo mostrar una vez por sesión
  if (sessionStorage.getItem('popup_shown')) return;

  try {
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDoc(doc(db, 'popup', 'config'));
    if (!snap.exists()) return;

    const data = snap.data();
    if (!data.activo) return;

    renderPopup(data);
    const delay = data.delay_ms ?? 3000;
    setTimeout(() => openPopup(), delay);

  } catch (err) {
    console.warn('Error al cargar popup:', err);
  }
}

function renderPopup(data) {
  const img   = document.getElementById('popup-img');
  const title = document.getElementById('popup-title');
  const text  = document.getElementById('popup-text');

  if (img)   { img.src = data.imagen_url || ''; img.hidden = !data.imagen_url; }
  if (title) title.textContent = data.titulo || '';
  if (text)  text.textContent  = data.texto  || '';
}

function openPopup() {
  const overlay = document.getElementById('popup-overlay');
  overlay?.classList.add('open');
  sessionStorage.setItem('popup_shown', '1');

  document.getElementById('popup-close')?.addEventListener('click', closePopup);
  overlay?.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePopup();
  }, { once: true });

  // Cerrar al hacer click en el CTA
  document.getElementById('popup-cta')?.addEventListener('click', closePopup);
}

function closePopup() {
  document.getElementById('popup-overlay')?.classList.remove('open');
}
