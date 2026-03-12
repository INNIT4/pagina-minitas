import { db, isConfigured } from './firebase-config.js';

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let blockedDates = new Set(); // "YYYY-MM-DD"
let unsubscribe  = null;

export function initCalendar() {
  const section = document.getElementById('disponibilidad');

  if (!isConfigured) {
    // Sin Firebase: mostrar calendario sin fechas bloqueadas
    renderCalendar();
    return;
  }

  subscribeToBlockedDates();

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });
}

function subscribeToBlockedDates() {
  import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    .then(({ doc, onSnapshot }) => {
      if (unsubscribe) unsubscribe();
      unsubscribe = onSnapshot(
        doc(db, 'availability', 'blocked_dates'),
        (snap) => {
          blockedDates.clear();
          if (snap.exists()) {
            const items = snap.data().fechas || [];
            items.forEach(item => blockedDates.add(item.fecha));
          }
          renderCalendar();
        },
        (err) => {
          console.warn('Error al leer disponibilidad:', err);
          renderCalendar(); // render sin fechas bloqueadas
        }
      );
    });
}

function renderCalendar() {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('calendar-grid');
  if (!label || !grid) return;

  label.textContent = `${MONTHS_ES[currentMonth]} ${currentYear}`;

  const today     = new Date();
  const firstDay  = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let html = DAYS_ES.map(d =>
    `<div class="calendar-day-header">${d}</div>`
  ).join('');

  // Celdas vacías antes del primer día
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const date    = new Date(currentYear, currentMonth, d);
    const isToday = date.toDateString() === today.toDateString();
    const isPast  = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isBlocked = blockedDates.has(dateStr);

    let cls = 'calendar-day';
    if (isPast)      cls += ' past';
    else if (isBlocked) cls += ' blocked';
    else             cls += ' available';
    if (isToday)     cls += ' today';

    const title = isBlocked ? 'No disponible' : (isPast ? '' : 'Disponible');
    html += `<div class="${cls}" title="${title}">${d}</div>`;
  }

  grid.innerHTML = html;
}
