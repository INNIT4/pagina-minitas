import { db } from '../../js/firebase-config.js';
import { CLIENT_CONFIG } from '../../config/client.js';

export function initAdminPaquetes() {
  loadPaquetes();
  document.getElementById('btn-save-paquetes')?.addEventListener('click', savePaquetes);
  document.getElementById('btn-add-paquete')?.addEventListener('click', addPaquete);
}

async function loadPaquetes() {
  const wrap = document.getElementById('paquetes-admin-wrap');
  if (!wrap) return;

  let items = (CLIENT_CONFIG.paquetes || []).map(p => ({
    nombre: p.nombre || '',
    precio_por_persona: p.precio_por_persona || 0,
    minimo_personas: p.minimo_personas || 0,
    destacado: p.destacado || false,
    incluye: p.incluye || []
  }));

  try {
    const { doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDoc(doc(db, 'config', 'paquetes'));
    if (snap.exists() && snap.data().items?.length) {
      items = snap.data().items;
    }
  } catch (err) {
    console.warn('Firestore no disponible, usando config local:', err);
  }

  wrap.innerHTML = '';
  items.forEach((p, i) => wrap.appendChild(buildCard(p, i)));
}

function buildCard(p, i) {
  const card = document.createElement('div');
  card.className = 'a-card paquete-card';
  card.dataset.index = i;
  card.style.marginBottom = '1rem';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
      <h2 class="a-card-title" style="margin:0">Paquete ${i + 1}</h2>
      <button type="button" class="a-btn a-btn-danger a-btn-sm btn-delete-paquete">Eliminar</button>
    </div>
    <div class="a-form-group">
      <label class="a-label">Nombre</label>
      <input class="a-input p-nombre" type="text" value="${escHtml(p.nombre || '')}" placeholder="Paquete Clásico">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="a-form-group">
        <label class="a-label">Precio por persona (MXN)</label>
        <input class="a-input p-precio" type="number" value="${p.precio_por_persona || 0}" min="0">
      </div>
      <div class="a-form-group">
        <label class="a-label">Mínimo de personas</label>
        <input class="a-input p-minimo" type="number" value="${p.minimo_personas || 0}" min="0">
      </div>
    </div>
    <div class="a-form-group">
      <label class="a-label">¿Es el destacado? (MÁS POPULAR)</label>
      <select class="a-input p-destacado">
        <option value="no" ${!p.destacado ? 'selected' : ''}>No</option>
        <option value="si" ${p.destacado ? 'selected' : ''}>Sí</option>
      </select>
    </div>
    <div class="a-form-group">
      <label class="a-label">Incluye (una línea por elemento)</label>
      <textarea class="a-input a-textarea p-incluye" rows="6">${escHtml((p.incluye || []).join('\n'))}</textarea>
    </div>
  `;

  card.querySelector('.btn-delete-paquete').addEventListener('click', () => {
    if (!confirm('¿Eliminar este paquete?')) return;
    card.remove();
    renumberCards();
  });

  return card;
}

function addPaquete() {
  const wrap = document.getElementById('paquetes-admin-wrap');
  if (!wrap) return;
  const i = wrap.querySelectorAll('.paquete-card').length;
  wrap.appendChild(buildCard({ nombre: '', precio_por_persona: 0, minimo_personas: 0, destacado: false, incluye: [] }, i));
}

function renumberCards() {
  document.querySelectorAll('.paquete-card').forEach((card, i) => {
    card.dataset.index = i;
    const title = card.querySelector('.a-card-title');
    if (title) title.textContent = 'Paquete ' + (i + 1);
  });
}

async function savePaquetes() {
  const btn    = document.getElementById('btn-save-paquetes');
  const status = document.getElementById('save-paquetes-status');
  if (!btn) return;

  btn.disabled = true;
  if (status) status.textContent = 'Guardando...';

  try {
    const items = Array.from(document.querySelectorAll('.paquete-card')).map(card => ({
      nombre:             card.querySelector('.p-nombre')?.value.trim() || '',
      precio_por_persona: parseInt(card.querySelector('.p-precio')?.value || '0', 10),
      minimo_personas:    parseInt(card.querySelector('.p-minimo')?.value || '0', 10),
      destacado:          card.querySelector('.p-destacado')?.value === 'si',
      incluye:            (card.querySelector('.p-incluye')?.value || '')
                            .split('\n').map(l => l.trim()).filter(l => l.length > 0)
    }));

    const { doc, setDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await setDoc(doc(db, 'config', 'paquetes'), { items });

    if (status) {
      status.textContent = '✓ Guardado';
      setTimeout(() => { status.textContent = ''; }, 3000);
    }
    showToast('Paquetes guardados correctamente', 'success');

  } catch (err) {
    console.error('Error al guardar paquetes:', err);
    showToast('Error al guardar. Intenta de nuevo.', 'error');
    if (status) status.textContent = '';
  } finally {
    btn.disabled = false;
  }
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'a-toast ' + type + ' show';
  setTimeout(() => toast.classList.remove('show'), 3000);
}
