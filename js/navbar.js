export function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  // Sticky: agrega clase .scrolled al hacer scroll
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    navMobile.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar mobile nav al hacer click en un link
  navMobile.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMobileNav();
  });

  // Cerrar mobile nav con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  buildMobileNav();
}

function closeMobileNav() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  document.getElementById('nav-mobile').classList.remove('open');
  document.body.style.overflow = '';
}

function buildMobileNav() {
  const { CLIENT_CONFIG } = window.__venueConfig || {};
  const navMobile = document.getElementById('nav-mobile');
  if (!navMobile || !CLIENT_CONFIG) return;

  const links = [
    { label: 'Nosotros',       href: '#nosotros' },
    { label: 'Galería',        href: '#galeria' },
    { label: 'Disponibilidad', href: '#disponibilidad' },
  ];

  let html = links.map(l =>
    `<a href="${l.href}" class="nav-mobile-link">${l.label}</a>`
  ).join('');

  if (CLIENT_CONFIG.nav_eventos?.length) {
    html += `<div class="nav-mobile-group">
      <div class="nav-mobile-group-title">Eventos</div>
      ${CLIENT_CONFIG.nav_eventos.map(e =>
        `<a href="#eventos#${e}">${formatLabel(e)}</a>`
      ).join('')}
    </div>`;
  }

  if (CLIENT_CONFIG.nav_espacios?.length) {
    html += `<div class="nav-mobile-group">
      <div class="nav-mobile-group-title">Espacios</div>
      ${CLIENT_CONFIG.nav_espacios.map(e =>
        `<a href="#espacios#${e}">${formatLabel(e)}</a>`
      ).join('')}
    </div>`;
  }

  html += `<a href="#contacto" class="nav-mobile-cta">Cotizar ahora</a>`;
  navMobile.innerHTML = html;
}

function formatLabel(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
