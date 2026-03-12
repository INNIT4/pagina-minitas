import { db } from '../../js/firebase-config.js';

const DAYS_ES   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let blocked  = new Set(); // "YYYY-MM-DD"

export function initAdminCalendar() {
  loadBlockedDates();

  document.getElementById('a-cal-prev')?.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderAdminCalendar();
  });

  document.getElementById('a-cal-next')?.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderAdminCalendar();
  });
}

async function loadBlockedDates() {
  try {
    const { doc, onSnapshot } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    onSnapshot(doc(db, 'availability', 'blocked_dates'), (snap) => {
      blocked.clear();
      if (snap.exists()) {
        (snap.data().fechas || []).forEach(f => blocked.add(f.fecha));
      }
      renderAdminCalendar();
    });
  } catch (err) {
    console.error('Error al cargar fechas bloqueadas:', err);
    renderAdminCalendar();
  }
}

function renderAdminCalendar() {
  const label = document.getElementById('a-cal-month');
  const grid  = document.getElementById('a-calendar-grid');
  if (!label || !grid) return;

  label.textContent = `${MONTHS_ES[calMonth]} ${calYear}`;

  const today      = new Date();
  const firstDay   = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let html = DAYS_ES.map(d => `<div class="a-day-header">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="a-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr  = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const date     = new Date(calYear, calMonth, d);
    const isToday  = date.toDateString() === today.toDateString();
    const isPast   = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isBlocked = blocked.has(dateStr);

    let cls = 'a-day';
    if (isPast)       cls += ' past';
    else if (isBlocked) cls += ' blocked';
    else              cls += ' available';
    if (isToday)      cls += ' today';

    const title = isPast ? '' : (isBlocked ? 'Click para desbloquear' : 'Click para bloquear');
    html += `<div class="${cls}" data-date="${dateStr}" title="${title}">${d}</div>`;
  }

  grid.innerHTML = html;

  // Eventos de click (solo días futuros)
  grid.querySelectorAll('.a-day.available, .a-day.blocked').forEach(el => {
    el.addEventListener('click', () => toggleDate(el.dataset.date));
  });
}

async function toggleDate(dateStr) {
  try {
    const { doc, getDoc, setDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const ref  = doc(db, 'availability', 'blocked_dates');
    const snap = await getDoc(ref);
    let fechas = snap.exists() ? (snap.data().fechas || []) : [];

    const exists = fechas.some(f => f.fecha === dateStr);
    if (exists) {
      fechas = fechas.filter(f => f.fecha !== dateStr);
      blocked.delete(dateStr);
    } else {
      fechas.push({ fecha: dateStr, motivo: 'Reservado' });
      blocked.add(dateStr);
    }

    await setDoc(ref, { fechas });
    renderAdminCalendar();
    showAdminToast(exists ? 'Fecha desbloqueada' : 'Fecha bloqueada', 'success');

  } catch (err) {
    console.error('Error al actualizar fecha:', err);
    showAdminToast('Error al actualizar fecha', 'error');
  }
}

function showAdminToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `a-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
