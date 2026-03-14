import { db, isConfigured } from './firebase-config.js';
import { CLIENT_CONFIG } from '../config/client.js';
import { formatLabel } from './config-loader.js';

// ── FALLBACKS ─────────────────────────────────────────────────
const FALLBACK = {
  hero: {
    texto_principal: CLIENT_CONFIG.tagline,
    subtexto: 'Creamos experiencias únicas e inolvidables para los momentos más especiales de tu vida.'
  },
  nosotros: {
    titulo: 'Tu evento, nuestra pasión',
    texto: 'Con más de una década de experiencia, hemos tenido el honor de ser parte de los momentos más especiales de cientos de familias en Hermosillo y Sonora.'
  },
  stats: [
    { valor: 500, sufijo: '+', etiqueta: 'Eventos realizados' },
    { valor: 10,  sufijo: '+', etiqueta: 'Años de experiencia' },
    { valor: 600, sufijo:  '', etiqueta: 'Invitados máx.' },
    { valor: 98,  sufijo: '%', etiqueta: 'Satisfacción' }
  ],
  eventos: CLIENT_CONFIG.nav_eventos.map(id => ({
    id, nombre: formatLabel(id),
    descripcion: `Servicios especializados para tu ${formatLabel(id).toLowerCase()}.`,
    emoji: getEventEmoji(id)
  })),
  espacios: CLIENT_CONFIG.nav_espacios.map(id => ({
    id, nombre: formatLabel(id),
    capacidad: '100–600 personas',
    descripcion: 'Espacio elegante y versátil para cualquier tipo de evento.',
    emoji: '🏛️'
  })),
  testimonios: [
    { nombre: 'María González',   evento: 'Boda',              texto: 'Todo fue perfecto. El salón es hermoso y el servicio impecable.', estrellas: 5 },
    { nombre: 'Carlos Ramírez',   evento: 'Quinceaños',        texto: 'Mi hija tuvo la mejor fiesta de XV años. La atención superó nuestras expectativas.', estrellas: 5 },
    { nombre: 'Empresa Construvida', evento: 'Evento empresarial', texto: 'Excelentes instalaciones para nuestro evento corporativo.', estrellas: 5 }
  ],
  faq: [
    { pregunta: '¿Con cuánta anticipación debo reservar?', respuesta: 'Recomendamos reservar con al menos 3–6 meses de anticipación para fechas populares.' },
    { pregunta: '¿El precio incluye decoración?',          respuesta: 'Tenemos paquetes que incluyen decoración básica. También puedes contratar proveedores asociados.' },
    { pregunta: '¿Puedo traer mi propio catering?',        respuesta: 'Contamos con servicio de catering propio. También trabajamos con proveedores externos previamente aprobados.' },
    { pregunta: '¿Cuál es la capacidad máxima?',           respuesta: 'Nuestro salón principal tiene capacidad para hasta 600 personas.' },
    { pregunta: '¿Ofrecen estacionamiento?',               respuesta: 'Sí, contamos con amplio estacionamiento gratuito para todos los eventos.' }
  ]
};

// ── HELPERS ───────────────────────────────────────────────────
async function firestoreGet(path) {
  if (!isConfigured) return null;
  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDoc(doc(db, ...path.split('/')));
    return snap.exists() ? snap.data() : null;
  } catch { return null; }
}

async function firestoreCollection(col, ...queryArgs) {
  if (!isConfigured) return null;
  try {
    const { collection, getDocs, query, orderBy, where } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    let q = collection(db, col);
    if (queryArgs.length) q = query(q, ...queryArgs.map(a => {
      if (a.type === 'orderBy') return orderBy(a.field, a.dir);
      if (a.type === 'where')   return where(a.field, a.op, a.val);
      return a;
    }));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return null; }
}

// ── EXPORTS INDIVIDUALES ──────────────────────────────────────
export async function loadHero() {
  const data = await firestoreGet('content/hero') || FALLBACK.hero;
  const title = document.getElementById('hero-title');
  const sub   = document.getElementById('hero-subtitle');
  if (title && data.texto_principal) title.textContent = data.texto_principal;
  if (sub   && data.subtexto)        sub.textContent   = data.subtexto;
}

export async function loadNosotros() {
  const data = await firestoreGet('content/nosotros') || FALLBACK.nosotros;
  const title = document.getElementById('nosotros-title');
  const text  = document.getElementById('nosotros-text');
  const img   = document.getElementById('about-img');
  if (title && data.titulo)     title.textContent = data.titulo;
  if (text  && data.texto)      text.textContent  = data.texto;
  if (img   && data.imagen_url) img.src           = data.imagen_url;
}

export async function loadStats() {
  const data = await firestoreGet('content/stats');
  const stats = data?.items || FALLBACK.stats;
  const grid  = document.getElementById('stats-grid');
  if (!grid) return;
  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}">
      <div class="stat-number" data-target="${s.valor}" data-sufijo="${s.sufijo || ''}">${s.valor}${s.sufijo || ''}</div>
      <div class="stat-label">${s.etiqueta}</div>
    </div>
  `).join('');
}

const EVENTO_TIPO_MAP = {
  bodas: 'Boda',
  xv: 'XV Años',
  bautizos: 'Bautizo',
  empresariales: 'Evento empresarial',
  cumpleanos: 'Cumpleaños',
  graduacion: 'Graduación',
  aniversario: 'Aniversario'
};

export async function loadEventos() {
  const data = await firestoreCollection('eventos') || FALLBACK.eventos;
  const grid = document.getElementById('eventos-grid');
  if (!grid) return;
  grid.innerHTML = data.map(e => {
    const tipo = EVENTO_TIPO_MAP[e.id] || e.nombre;
    const href = `contacto.html?tipo=${encodeURIComponent(tipo)}`;
    return `
    <a class="evento-card reveal" id="${e.id}" href="${href}">
      ${e.imagen_url
        ? `<img class="evento-img" src="${e.imagen_url}" alt="${e.nombre}" loading="lazy">`
        : `<div class="evento-img-placeholder">${e.emoji || '🎉'}</div>`
      }
      <div class="evento-body">
        <h3 class="evento-name">${e.nombre}</h3>
        <p class="evento-desc">${e.descripcion || ''}</p>
        <span class="evento-cta">Cotizar este evento →</span>
      </div>
    </a>
  `;
  }).join('');
}

export async function loadEspacios() {
  const data = await firestoreCollection('espacios') || FALLBACK.espacios;
  const grid = document.getElementById('espacios-grid');
  if (!grid) return;
  grid.innerHTML = data.map(e => `
    <div class="espacio-card reveal" id="${e.id}">
      <div class="espacio-img">
        ${e.imagen_url
          ? `<img src="${e.imagen_url}" alt="${e.nombre}" loading="lazy">`
          : `<span style="font-size:3rem">🏛️</span>`
        }
      </div>
      <div class="espacio-body">
        <h3 class="espacio-name">${e.nombre}</h3>
        ${e.capacidad ? `<div class="espacio-capacidad">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          ${e.capacidad}
        </div>` : ''}
        <p class="espacio-desc">${e.descripcion || ''}</p>
      </div>
    </div>
  `).join('');
}

export async function loadTestimonios() {
  const data = await firestoreCollection('testimonios') || FALLBACK.testimonios;
  const grid = document.getElementById('testimonios-grid');
  if (!grid) return;
  grid.innerHTML = data.map(t => `
    <div class="testimonio-card reveal">
      <div class="testimonio-stars">${'★'.repeat(t.estrellas || 5)}</div>
      <p class="testimonio-text">"${t.texto}"</p>
      <div class="testimonio-author">
        <span class="testimonio-name">${t.nombre}</span>
        <span class="testimonio-evento">${t.evento}</span>
      </div>
    </div>
  `).join('');
}

export async function loadFaq() {
  const data = await firestoreCollection('faq') || FALLBACK.faq;
  const html = data.map((item, i) => `
    <li class="faq-item">
      <button class="faq-question" aria-expanded="false" data-faq="${i}">
        <span>${item.pregunta}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${i}">
        <div class="faq-answer-inner">${item.respuesta}</div>
      </div>
    </li>
  `).join('');
  // Aplica al elemento correcto según la página
  ['faq-list', 'faq-list-index'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

export async function loadPaquetes() {
  const grid = document.getElementById('paquetes-grid');
  if (!grid) return;

  let items = CLIENT_CONFIG.paquetes || [];

  try {
    const data = await firestoreGet('config/paquetes');
    if (data?.items?.length) items = data.items;
  } catch { /* usa fallback */ }

  grid.innerHTML = items.map(function(p, i) {
    const destacado = p.destacado || i === 1;
    const delayClass = i > 0 ? ' reveal-delay-' + i : '';
    const borderStyle = destacado ? ';border:2px solid var(--color-primary);position:relative' : '';
    const btnClass = destacado ? 'btn-primary' : 'btn-outline-dark';
    const badge = destacado
      ? '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--color-primary);color:white;font-size:.7rem;font-weight:700;letter-spacing:.1em;padding:.3rem .9rem;border-radius:99px">MÁS POPULAR</div>'
      : '';
    const liItems = (p.incluye || []).map(function(item) {
      return '<li style="display:flex;gap:.6rem;align-items:flex-start;font-size:.9rem;color:var(--color-text-muted)"><span style="color:var(--color-accent);font-weight:700">✓</span> ' + item + '</li>';
    }).join('');

    return '<div class="stat-card reveal' + delayClass + '" style="display:flex;flex-direction:column;gap:1rem;text-align:left;padding:2rem' + borderStyle + '">'
      + badge
      + '<div>'
      + '<span class="section-label" style="font-size:.75rem">DESDE</span>'
      + '<div style="font-family:\'Playfair Display\',serif;font-size:2.2rem;font-weight:700;color:var(--color-primary);line-height:1">$' + p.precio_por_persona + ' <span style="font-size:1rem;font-weight:400;color:var(--color-text-muted)">/ persona</span></div>'
      + '<h3 style="font-family:\'Playfair Display\',serif;font-size:1.15rem;margin-top:.5rem">' + p.nombre + '</h3>'
      + '</div>'
      + '<ul style="list-style:none;display:flex;flex-direction:column;gap:.5rem;flex:1">'
      + liItems
      + '<li style="display:flex;gap:.6rem;align-items:flex-start;font-size:.9rem;color:var(--color-text-muted)"><span style="color:var(--color-accent);font-weight:700">✓</span> Mínimo ' + p.minimo_personas + ' personas</li>'
      + '</ul>'
      + '<a href="contacto.html" class="btn ' + btnClass + '" style="text-align:center">Cotizar este paquete</a>'
      + '</div>';
  }).join('');
}

// ── CARGA COMPLETA (index.html) ───────────────────────────────
export async function loadContent() {
  await Promise.all([
    loadHero(),
    loadNosotros(),
    loadStats(),
    loadEventos(),
    loadEspacios(),
    loadTestimonios(),
    loadFaq()
  ]);
}

function getEventEmoji(id) {
  const map = { bodas: '💍', xv: '👑', bautizos: '✨', empresariales: '🏢' };
  return map[id] || '🎉';
}
