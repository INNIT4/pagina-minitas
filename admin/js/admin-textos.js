import { db } from '../../js/firebase-config.js';

export function initAdminTextos() {
  loadTextos();

  document.getElementById('form-textos')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveTextos();
  });
}

async function loadTextos() {
  try {
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const [heroSnap, nosSnap] = await Promise.all([
      getDoc(doc(db, 'content', 'hero')),
      getDoc(doc(db, 'content', 'nosotros'))
    ]);

    if (heroSnap.exists()) {
      const h = heroSnap.data();
      setVal('t-hero-titulo', h.texto_principal);
      setVal('t-hero-sub',    h.subtexto);
    }

    if (nosSnap.exists()) {
      const n = nosSnap.data();
      setVal('t-nos-titulo', n.titulo);
      setVal('t-nos-texto',  n.texto);
      setVal('t-nos-img',    n.imagen_url);
    }
  } catch (err) {
    console.error('Error al cargar textos:', err);
  }
}

async function saveTextos() {
  const btn    = document.getElementById('btn-save-textos');
  const status = document.getElementById('save-textos-status');
  if (!btn) return;

  btn.disabled = true;
  if (status) status.textContent = 'Guardando...';

  try {
    const { doc, setDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    await Promise.all([
      setDoc(doc(db, 'content', 'hero'), {
        texto_principal: getVal('t-hero-titulo'),
        subtexto:        getVal('t-hero-sub')
      }, { merge: true }),

      setDoc(doc(db, 'content', 'nosotros'), {
        titulo:     getVal('t-nos-titulo'),
        texto:      getVal('t-nos-texto'),
        imagen_url: getVal('t-nos-img')
      }, { merge: true })
    ]);

    if (status) {
      status.textContent = '✓ Guardado';
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
    showAdminToast('Textos guardados correctamente', 'success');

  } catch (err) {
    console.error('Error al guardar textos:', err);
    showAdminToast('Error al guardar. Intenta de nuevo.', 'error');
  } finally {
    btn.disabled = false;
  }
}

function getVal(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function showAdminToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `a-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
