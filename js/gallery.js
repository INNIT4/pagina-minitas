import { db, isConfigured } from './firebase-config.js';
import { CLIENT_CONFIG } from '../config/client.js';

let galleryItems = [];
let currentIndex = 0;
let activeFilter = 'todos';

export async function initGallery() {
  const items = await loadGalleryItems();
  galleryItems = items;
  buildFilters(items);
  renderGallery(items);
  initLightbox();
}

async function loadGalleryItems() {
  if (!isConfigured) return getFallbackItems();

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDocs(query(collection(db, 'gallery'), orderBy('orden')));
    if (snap.empty) return getFallbackItems();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return getFallbackItems();
  }
}

function getFallbackItems() {
  // Fotos placeholder por categoría
  return CLIENT_CONFIG.nav_eventos.flatMap((cat, ci) =>
    Array.from({ length: 3 }, (_, i) => ({
      id: `${cat}-${i}`,
      url: `assets/gallery/${cat}/foto${i + 1}.jpg`,
      categoria: cat,
      orden: ci * 3 + i
    }))
  );
}

function buildFilters(items) {
  const container = document.getElementById('gallery-filters');
  if (!container) return;

  const categorias = ['todos', ...new Set(items.map(i => i.categoria).filter(Boolean))];

  container.innerHTML = categorias.map(cat => `
    <button class="gallery-filter-btn ${cat === 'todos' ? 'active' : ''}"
            data-filter="${cat}">
      ${cat === 'todos' ? 'Todos' : formatLabel(cat)}
    </button>
  `).join('');

  container.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      const filtered = activeFilter === 'todos' ? items : items.filter(i => i.categoria === activeFilter);
      renderGallery(filtered);
    });
  });
}

function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = items.map((item, idx) => `
    <div class="gallery-item reveal" data-index="${idx}" data-url="${item.url}" role="button" tabindex="0"
         aria-label="Ver imagen de ${formatLabel(item.categoria || 'evento')}">
      <img src="${item.url}" alt="${formatLabel(item.categoria || 'evento')}" loading="lazy"
           onerror="this.parentElement.style.display='none'">
      <div class="gallery-item-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
        </svg>
      </div>
    </div>
  `).join('');

  // Evento click para lightbox
  grid.querySelectorAll('.gallery-item').forEach(el => {
    const open = () => openLightbox(parseInt(el.dataset.index), items);
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => shiftLightbox(-1));
  nextBtn?.addEventListener('click', () => shiftLightbox(1));

  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  shiftLightbox(-1);
    if (e.key === 'ArrowRight') shiftLightbox(1);
  });
}

function openLightbox(index, items) {
  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('lightbox-img');
  if (!lightbox || !img) return;

  currentIndex = index;
  img.src = items[index]?.url || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function shiftLightbox(dir) {
  const filtered = activeFilter === 'todos'
    ? galleryItems
    : galleryItems.filter(i => i.categoria === activeFilter);
  currentIndex = (currentIndex + dir + filtered.length) % filtered.length;
  const img = document.getElementById('lightbox-img');
  if (img) img.src = filtered[currentIndex]?.url || '';
}

function formatLabel(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
