import { CLIENT_CONFIG } from '../config/client.js';

// Aplica colores del cliente como CSS variables
function applyColorTokens() {
  const root = document.documentElement;
  const c = CLIENT_CONFIG.colores;
  root.style.setProperty('--color-primary',       c.primario);
  root.style.setProperty('--color-primary-light',  c.primario_claro);
  root.style.setProperty('--color-accent',         c.acento);
  root.style.setProperty('--color-bg',             c.fondo);
  root.style.setProperty('--color-text',           c.texto);
}

// Rellena SEO meta tags
function applySEO() {
  const s = CLIENT_CONFIG.seo;

  document.title = s.title;
  setMeta('name', 'description', s.description);
  setMeta('name', 'keywords', s.keywords);

  setMeta('property', 'og:title', s.title);
  setMeta('property', 'og:description', s.description);
  setMeta('property', 'og:image', s.og_image);
  setMeta('property', 'og:url', s.url_canonica);

  setMeta('name', 'twitter:title', s.title);
  setMeta('name', 'twitter:description', s.description);
  setMeta('name', 'twitter:image', s.og_image);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = s.url_canonica;

  applyLocalBusinessSchema();
}

function setMeta(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.content = content;
}

function applyLocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": CLIENT_CONFIG.nombre,
    "description": CLIENT_CONFIG.seo.description,
    "url": CLIENT_CONFIG.seo.url_canonica,
    "telephone": CLIENT_CONFIG.telefono,
    "email": CLIENT_CONFIG.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CLIENT_CONFIG.direccion,
      "addressLocality": "Hermosillo",
      "addressRegion": "Sonora",
      "addressCountry": "MX"
    },
    "image": CLIENT_CONFIG.seo.og_image,
    "sameAs": Object.values(CLIENT_CONFIG.redes).filter(Boolean)
  };

  const el = document.getElementById('schema-localbusiness');
  if (el) el.textContent = JSON.stringify(schema);
}

// Rellena contenido estático visible sin JS
function applyStaticContent() {
  const c = CLIENT_CONFIG;

  // Navbar
  setText('nav-brand-name', c.nombre);

  // Dropdowns de navegación (apuntan a las páginas dedicadas)
  buildNavDropdown('nav-eventos', c.nav_eventos, 'eventos.html');
  buildNavDropdown('nav-espacios', c.nav_espacios, 'espacios.html');

  // Hero
  setText('hero-title', c.tagline || 'El lugar perfecto para tu evento');
  setText('hero-cta', null, true); // mantiene HTML del botón
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) heroCta.childNodes[heroCta.childNodes.length - 1].textContent = ' ' + c.hero_cta_texto;

  // Contacto info
  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) {
    phoneLink.href = `tel:${c.telefono.replace(/\s/g, '')}`;
    phoneLink.textContent = c.telefono;
  }
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) {
    emailLink.href = `mailto:${c.email}`;
    emailLink.textContent = c.email;
  }
  setText('contact-address', c.direccion);

  // Mapa embed
  const mapIframe = document.getElementById('map-iframe');
  if (mapIframe && c.maps_embed_url) mapIframe.src = c.maps_embed_url;

  // Footer
  setText('footer-brand-name', c.nombre);
  setText('footer-tagline', c.tagline);
  setText('footer-copy', `© ${new Date().getFullYear()} ${c.nombre}. Todos los derechos reservados.`);
  buildFooterSocials(c.redes);
  buildFooterEventos(c.nav_eventos);
  buildFooterContact(c);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== null) el.textContent = text;
}

function buildNavDropdown(id, items, baseHref) {
  const ul = document.getElementById(id);
  if (!ul || !items) return;
  ul.innerHTML = items.map(item =>
    `<li><a href="${baseHref}#${item}">${formatLabel(item)}</a></li>`
  ).join('');
}

function buildFooterEventos(items) {
  const ul = document.getElementById('footer-eventos');
  if (!ul || !items) return;
  ul.innerHTML = items.map(item =>
    `<li><a href="eventos.html#${item}">${formatLabel(item)}</a></li>`
  ).join('');
}

function buildFooterSocials(redes) {
  const container = document.getElementById('footer-socials');
  if (!container || !redes) return;
  const icons = {
    facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    tiktok: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.98a8.2 8.2 0 004.79 1.54V7.07a4.85 4.85 0 01-1.02-.38z"/></svg>`
  };

  container.innerHTML = Object.entries(redes)
    .filter(([, url]) => url)
    .map(([red, url]) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="${red}">
        ${icons[red] || ''}
      </a>`
    ).join('');
}

function buildFooterContact(c) {
  const ul = document.getElementById('footer-contact');
  if (!ul) return;
  ul.innerHTML = `
    <li class="footer-contact-item">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      <a href="tel:${c.telefono.replace(/\s/g, '')}" style="color:inherit">${c.telefono}</a>
    </li>
    <li class="footer-contact-item">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
      <a href="mailto:${c.email}" style="color:inherit">${c.email}</a>
    </li>
    <li class="footer-contact-item">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
      <span>${c.direccion}</span>
    </li>
  `;
}

export function formatLabel(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function initConfigLoader() {
  applyColorTokens();
  applySEO();
  applyStaticContent();
}
