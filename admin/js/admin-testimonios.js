import { db } from '../../js/firebase-config.js';

export function initAdminTestimonios() {
  loadTestimonios();

  document.getElementById('form-add-testimonio')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await addTestimonio();
  });
}

async function loadTestimonios() {
  const list = document.getElementById('testimonios-admin-list');
  if (!list) return;
  list.innerHTML = '<div class="empty-state">Cargando...</div>';

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const snap = await getDocs(query(collection(db, 'testimonios'), orderBy('timestamp', 'desc')));

    if (snap.empty) {
      list.innerHTML = '<div class="empty-state">No hay testimonios todavía.</div>';
      return;
    }

    list.innerHTML = snap.docs.map(d => {
      const t = { id: d.id, ...d.data() };
      const estrellas = '★'.repeat(t.estrellas || 5) + '☆'.repeat(5 - (t.estrellas || 5));
      return `
        <div class="a-card" style="margin-bottom:1rem" data-id="${t.id}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap">
            <div style="flex:1;min-width:0">
              <div style="font-weight:600">${escHtml(t.nombre || '')}</div>
              <div style="font-size:.85rem;color:var(--color-text-muted)">${escHtml(t.evento || '')}</div>
              <div style="color:#C9A84C;letter-spacing:2px;margin:.25rem 0">${estrellas}</div>
              <p style="margin:.5rem 0 0;white-space:pre-wrap">${escHtml(t.texto || '')}</p>
            </div>
            <div style="display:flex;gap:.5rem;flex-shrink:0;align-items:center">
              <button class="a-btn a-btn-sm ${t.visible ? 'a-btn-primary' : ''}"
                      data-toggle="${t.id}" data-visible="${t.visible ? '1' : '0'}"
                      title="${t.visible ? 'Visible' : 'Oculto'}">
                ${t.visible ? '👁 Visible' : '🚫 Oculto'}
              </button>
              <button class="a-btn a-btn-sm a-btn-danger" data-delete="${t.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => toggleVisible(btn.dataset.toggle, btn.dataset.visible !== '1'));
    });

    list.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deleteTestimonio(btn.dataset.delete));
    });

  } catch (err) {
    console.error('Error al cargar testimonios:', err);
    list.innerHTML = '<div class="empty-state">Error al cargar.</div>';
  }
}

async function addTestimonio() {
  const btn = document.getElementById('btn-add-testimonio');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  try {
    const nombre   = document.getElementById('t-nombre')?.value.trim() || '';
    const evento   = document.getElementById('t-evento')?.value.trim() || '';
    const texto    = document.getElementById('t-texto')?.value.trim() || '';
    const estrellas = parseInt(document.getElementById('t-estrellas')?.value || '5', 10);

    if (!nombre || !texto) {
      showToast('Nombre y texto son requeridos', 'error');
      return;
    }

    const { collection, addDoc, serverTimestamp } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    await addDoc(collection(db, 'testimonios'), {
      nombre,
      evento,
      texto,
      estrellas,
      visible: true,
      timestamp: serverTimestamp()
    });

    document.getElementById('form-add-testimonio')?.reset();
    showToast('Testimonio agregado', 'success');
    loadTestimonios();

  } catch (err) {
    console.error('Error al agregar testimonio:', err);
    showToast('Error al guardar', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Agregar'; }
  }
}

async function toggleVisible(id, newVisible) {
  try {
    const { doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await updateDoc(doc(db, 'testimonios', id), { visible: newVisible });
    showToast(newVisible ? 'Testimonio visible' : 'Testimonio oculto', 'success');
    loadTestimonios();
  } catch (err) {
    console.error('Error al actualizar visibilidad:', err);
    showToast('Error al actualizar', 'error');
  }
}

async function deleteTestimonio(id) {
  if (!confirm('¿Eliminar este testimonio?')) return;
  try {
    const { doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await deleteDoc(doc(db, 'testimonios', id));
    showToast('Testimonio eliminado', 'success');
    loadTestimonios();
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
