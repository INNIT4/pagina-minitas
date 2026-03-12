import { db } from '../../js/firebase-config.js';
import { CLIENT_CONFIG } from '../../config/client.js';

let allCotizaciones = [];
let activeFilter = 'all';

export function initAdminCotizaciones() {
  loadCotizaciones();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderCotizaciones();
    });
  });
}

function loadCotizaciones() {
  import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    .then(({ collection, onSnapshot, orderBy, query }) => {
      const q = query(collection(db, 'cotizaciones'), orderBy('timestamp', 'desc'));
      onSnapshot(q, (snap) => {
        allCotizaciones = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderCotizaciones();
      }, (err) => {
        console.error('Error al cargar cotizaciones:', err);
        document.getElementById('cotizaciones-list').innerHTML =
          '<div class="empty-state">Error al cargar cotizaciones.</div>';
      });
    });
}

function renderCotizaciones() {
  const list = document.getElementById('cotizaciones-list');
  if (!list) return;

  const filtered = activeFilter === 'unread'
    ? allCotizaciones.filter(c => !c.leido)
    : allCotizaciones;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">
      ${activeFilter === 'unread' ? 'No hay cotizaciones sin leer.' : 'Aún no hay cotizaciones.'}
    </div>`;
    return;
  }

  list.innerHTML = filtered.map(c => `
    <div class="cotizacion-card ${c.leido ? '' : 'unread'}" data-id="${c.id}">
      <div>
        <div class="cotizacion-header">
          ${!c.leido ? '<span class="unread-dot"></span>' : ''}
          <span class="cotizacion-nombre">${escHtml(c.nombre)}</span>
          <span class="cotizacion-badge">${escHtml(c.tipo_evento || '')}</span>
        </div>
        <div class="cotizacion-meta">
          <span>📅 ${formatDate(c.fecha)}</span>
          <span>👥 ${c.personas} personas</span>
          <span>📞 ${escHtml(c.telefono || '')}</span>
        </div>
        ${c.mensaje ? `<p class="cotizacion-mensaje">${escHtml(c.mensaje)}</p>` : ''}
      </div>
      <div class="cotizacion-actions">
        <span class="cotizacion-date">${formatTimestamp(c.timestamp)}</span>
        <a href="https://wa.me/${CLIENT_CONFIG.whatsapp}?text=${buildWAReply(c)}"
           target="_blank" rel="noopener" class="a-btn a-btn-primary a-btn-sm">
          WhatsApp
        </a>
        ${!c.leido
          ? `<button class="a-btn a-btn-sm" style="border:1px solid var(--a-border)"
               data-mark-read="${c.id}">Marcar leída</button>`
          : ''
        }
      </div>
    </div>
  `).join('');

  // Listener marcar como leída
  list.querySelectorAll('[data-mark-read]').forEach(btn => {
    btn.addEventListener('click', () => markRead(btn.dataset.markRead));
  });
}

async function markRead(id) {
  try {
    const { doc, updateDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await updateDoc(doc(db, 'cotizaciones', id), { leido: true });
  } catch (err) {
    console.error('Error al marcar como leída:', err);
  }
}

function buildWAReply(c) {
  const text = `Hola ${c.nombre}, gracias por tu interés en ${CLIENT_CONFIG.nombre}. Recibimos tu solicitud para un ${c.tipo_evento} el ${formatDate(c.fecha)} para ${c.personas} personas. Con gusto te compartimos más información.`;
  return encodeURIComponent(text);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
}

function formatTimestamp(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}
