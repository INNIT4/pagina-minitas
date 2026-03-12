import { db, isConfigured } from './firebase-config.js';
import { CLIENT_CONFIG } from '../config/client.js';
import { formatLabel } from './config-loader.js';

// Fallback data cuando no hay Firestore
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
    { valor: 800, sufijo:  '', etiqueta: 'Invitados máx.' },
    { valor: 98,  sufijo: '%', etiqueta: 'Satisfacción' }
  ],
  eventos: CLIENT_CONFIG.nav_eventos.map(id => ({
    id,
    nombre: formatLabel(id),
    descripcion: `Servicios especializados para tu ${formatLabel(id).toLowerCase()}.`,
    emoji: getEventEmoji(id)
  })),
  espacios: CLIENT_CONFIG.nav_espacios.map(id => ({
    id,
    nombre: formatLabel(id),
    capacidad: '200–800 personas',
    descripcion: `Espacio elegante y versátil para cualquier tipo de evento.`,
    emoji: '🏛️'
  })),
  testimonios: [
    {
      nombre: 'María González',
      evento: 'Boda',
      texto: 'Todo fue perfecto. El salón es hermoso y el servicio impecable. Definitivamente lo recomendaría para cualquier evento.',
      estrellas: 5
    },
    {
      nombre: 'Carlos Ramírez',
      evento: 'Quinceaños',
      texto: 'Mi hija tuvo la mejor fiesta de XV años. La atención del personal y la calidad de las instalaciones superaron nuestras expectativas.',
      estrellas: 5
    },
    {
      nombre: 'Empresa Construvida',
      evento: 'Evento empresarial',
      texto: 'Excelentes instalaciones para nuestro evento corporativo. La tecnología audiovisual y el servicio de catering fueron sobresalientes.',
      estrellas: 5
    }
  ],
  faq: [
    { pregunta: '¿Con cuánta anticipación debo reservar?', respuesta: 'Recomendamos reservar con al menos 3–6 meses de anticipación para fechas populares. Sin embargo, contáctanos para verificar disponibilidad.' },
    { pregunta: '¿El precio incluye decoración?', respuesta: 'Tenemos paquetes que incluyen decoración básica. También puedes contratar nuestros proveedores asociados para una decoración más elaborada.' },
    { pregunta: '¿Puedo traer mi propio catering?', respuesta: 'Contamos con servicio de catering propio con distintos menús. También podemos trabajar con proveedores externos previamente aprobados.' },
    { pregunta: '¿Cuál es la capacidad máxima del salón?', respuesta: 'Nuestro salón principal tiene capacidad para hasta 800 personas. Contamos con espacios más íntimos para eventos de menor tamaño.' },
    { pregunta: '¿Ofrecen servicio de estacionamiento?', respuesta: 'Sí, contamos con amplio estacionamiento gratuito para todos los eventos.' }
  ]
};

export async function loadContent() {
  if (!isConfigured) {
    applyFallbackContent();
    return;
  }

  try {
    const { doc, getDoc, collection, getDocs, query, where, orderBy } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const [heroSnap, nosotrosSnap, statsSnap] = await Promise.all([
      getDoc(doc(db, 'content', 'hero')),
      getDoc(doc(db, 'content', 'nosotros')),
      getDoc(doc(db, 'content', 'stats'))
    ]);

    const hero     = heroSnap.exists()     ? heroSnap.data()     : FALLBACK.hero;
    const nosotros = nosotrosSnap.exists() ? nosotrosSnap.data() : FALLBACK.nosotros;
    const stats    = statsSnap.exists()    ? statsSnap.data().items : FALLBACK.stats;

    applyHeroContent(hero);
    applyNosotrosContent(nosotros);
    applyStats(stats);

    // Cargar eventos y espacios en paralelo
    const [eventosSnaps, espaciosSnaps, testimoniosSnaps, faqSnaps] = await Promise.all([
      getDocs(collection(db, 'eventos')),
      getDocs(collection(db, 'espacios')),
      getDocs(query(collection(db, 'testimonios'), where('visible', '==', true))),
      getDocs(query(collection(db, 'faq'), orderBy('orden')))
    ]);

    const eventos    = eventosSnaps.empty    ? FALLBACK.eventos    : eventosSnaps.docs.map(d => ({ id: d.id, ...d.data() }));
    const espacios   = espaciosSnaps.empty   ? FALLBACK.espacios   : espaciosSnaps.docs.map(d => ({ id: d.id, ...d.data() }));
    const testimonios = testimoniosSnaps.empty ? FALLBACK.testimonios : testimoniosSnaps.docs.map(d => d.data());
    const faq        = faqSnaps.empty        ? FALLBACK.faq        : faqSnaps.docs.map(d => d.data());

    renderEventos(eventos);
    renderEspacios(espacios);
    renderTestimonios(testimonios);
    renderFAQ(faq);

  } catch (err) {
    console.warn('Firestore no disponible, usando datos de fallback.', err);
    applyFallbackContent();
  }
}

function applyFallbackContent() {
  applyHeroContent(FALLBACK.hero);
  applyNosotrosContent(FALLBACK.nosotros);
  applyStats(FALLBACK.stats);
  renderEventos(FALLBACK.eventos);
  renderEspacios(FALLBACK.espacios);
  renderTestimonios(FALLBACK.testimonios);
  renderFAQ(FALLBACK.faq);
}

function applyHeroContent(hero) {
  const title = document.getElementById('hero-title');
  const sub   = document.getElementById('hero-subtitle');
  if (title && hero.texto_principal) title.textContent = hero.texto_principal;
  if (sub   && hero.subtexto)        sub.textContent   = hero.subtexto;
}

function applyNosotrosContent(nos) {
  const title = document.getElementById('nosotros-title');
  const text  = document.getElementById('nosotros-text');
  if (title && nos.titulo) title.textContent = nos.titulo;
  if (text  && nos.texto)  text.textContent  = nos.texto;
  const img = document.getElementById('about-img');
  if (img && nos.imagen_url) img.src = nos.imagen_url;
}

function applyStats(stats) {
  const grid = document.getElementById('stats-grid');
  if (!grid || !stats?.length) return;
  grid.innerHTML = stats.map((s, i) => `
    <div class="stat-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}">
      <div class="stat-number" data-target="${s.valor}" data-sufijo="${s.sufijo || ''}">${s.valor}${s.sufijo || ''}</div>
      <div class="stat-label">${s.etiqueta}</div>
    </div>
  `).join('');
}

function renderEventos(eventos) {
  const grid = document.getElementById('eventos-grid');
  if (!grid) return;
  grid.innerHTML = eventos.map(e => `
    <div class="evento-card reveal">
      ${e.imagen_url
        ? `<img class="evento-img" src="${e.imagen_url}" alt="${e.nombre}" loading="lazy">`
        : `<div class="evento-img-placeholder">${e.emoji || '🎉'}</div>`
      }
      <div class="evento-body">
        <h3 class="evento-name">${e.nombre}</h3>
        <p class="evento-desc">${e.descripcion || ''}</p>
      </div>
    </div>
  `).join('');
}

function renderEspacios(espacios) {
  const grid = document.getElementById('espacios-grid');
  if (!grid) return;
  grid.innerHTML = espacios.map(e => `
    <div class="espacio-card reveal">
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

function renderTestimonios(testimonios) {
  const grid = document.getElementById('testimonios-grid');
  if (!grid) return;
  grid.innerHTML = testimonios.map(t => `
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

function renderFAQ(items) {
  const list = document.getElementById('faq-list');
  if (!list) return;
  list.innerHTML = items.map((item, i) => `
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
}

function getEventEmoji(id) {
  const map = { bodas: '💍', xv: '👑', bautizos: '✨', empresariales: '🏢' };
  return map[id] || '🎉';
}
