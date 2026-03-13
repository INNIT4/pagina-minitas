import { db } from '../../js/firebase-config.js';

export function initAdminFaq() {
  loadFaq();

  document.getElementById('form-add-faq')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addFaq();
  });
}

async function loadFaq() {
  const list = document.getElementById('faq-admin-list');
  if (!list) return;
  list.innerHTML = '<div class="empty-state">Cargando...</div>';

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const snap = await getDocs(query(collection(db, 'faq'), orderBy('orden', 'asc')));

    if (snap.empty) {
      list.innerHTML = '<div class="empty-state">No hay preguntas frecuentes todavía.</div>';
      return;
    }

    list.innerHTML = snap.docs.map(d => {
      const f = { id: d.id, ...d.data() };
      return `
        <div class="a-card" style="margin-bottom:1rem" data-id="${f.id}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem">
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;margin-bottom:.35rem">${escHtml(f.pregunta || '')}</div>
              <p style="margin:0;color:var(--color-text-muted);white-space:pre-wrap">${escHtml(f.respuesta || '')}</p>
            </div>
            <button class="a-btn a-btn-sm a-btn-danger" data-delete="${f.id}" style="flex-shrink:0">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deleteFaq(btn.dataset.delete));
    });

  } catch (err) {
    console.error('Error al cargar FAQ:', err);
    list.innerHTML = '<div class="empty-state">Error al cargar.</div>';
  }
}

async function addFaq() {
  const btn = document.getElementById('btn-add-faq');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  try {
    const pregunta  = document.getElementById('f-pregunta')?.value.trim() || '';
    const respuesta = document.getElementById('f-respuesta')?.value.trim() || '';

    if (!pregunta || !respuesta) {
      showToast('Pregunta y respuesta son requeridas', 'error');
      return;
    }

    const { collection, addDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    await addDoc(collection(db, 'faq'), {
      pregunta,
      respuesta,
      orden: Date.now()
    });

    document.getElementById('form-add-faq')?.reset();
    showToast('Pregunta agregada', 'success');
    loadFaq();

  } catch (err) {
    console.error('Error al agregar FAQ:', err);
    showToast('Error al guardar', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Agregar'; }
  }
}

async function deleteFaq(id) {
  if (!confirm('¿Eliminar esta pregunta?')) return;
  try {
    const { doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await deleteDoc(doc(db, 'faq', id));
    showToast('Pregunta eliminada', 'success');
    loadFaq();
  } catch (err) {
    console.error('Error al eliminar:', err);
    showToast('Error al eliminar', 'error');
  }
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `a-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
