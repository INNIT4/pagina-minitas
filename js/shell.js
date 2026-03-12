import { CLIENT_CONFIG } from '../config/client.js';
import { initConfigLoader, formatLabel } from './config-loader.js';
import { initNavbar } from './navbar.js';
import { initWhatsApp } from './whatsapp.js';
import { initReveal } from './reveal.js';

// Detecta la página activa por nombre de archivo
function getActivePage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path.replace('.html', '');
}

function injectNavbar() {
  const active = getActivePage();
  const isActive = (page) => active === page ? 'nav-link-active' : '';

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'navbar';
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="nav-logo">
        <img id="nav-logo-img" src="assets/logo.svg" alt="Logo" onerror="this.hidden=true">
        <span class="nav-logo-text" id="nav-brand-name">Salón</span>
      </a>
      <ul class="nav-links" role="list">
        <li><a href="nosotros.html" class="nav-link ${isActive('nosotros')}">Nosotros</a></li>
        <li class="nav-item">
          <a href="eventos.html" class="nav-link ${isActive('eventos')}">Eventos &#9662;</a>
          <ul class="nav-dropdown" id="nav-eventos" role="list"></ul>
        </li>
        <li class="nav-item">
          <a href="espacios.html" class="nav-link ${isActive('espacios')}">Espacios &#9662;</a>
          <ul class="nav-dropdown" id="nav-espacios" role="list"></ul>
        </li>
        <li><a href="galeria.html" class="nav-link ${isActive('galeria')}">Galería</a></li>
        <li><a href="disponibilidad.html" class="nav-link ${isActive('disponibilidad')}">Disponibilidad</a></li>
        <li><a href="contacto.html" class="nav-link nav-cta">Cotizar</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const mobileNav = document.createElement('nav');
  mobileNav.className = 'nav-mobile';
  mobileNav.id = 'nav-mobile';
  mobileNav.setAttribute('aria-label', 'Menú móvil');
  mobileNav.innerHTML = buildMobileNavHTML();

  document.body.insertBefore(mobileNav, document.body.firstChild);
  document.body.insertBefore(nav, document.body.firstChild);
}

function buildMobileNavHTML() {
  const c = CLIENT_CONFIG;
  let html = `
    <a href="nosotros.html" class="nav-mobile-link">Nosotros</a>
    <a href="galeria.html" class="nav-mobile-link">Galería</a>
    <a href="disponibilidad.html" class="nav-mobile-link">Disponibilidad</a>
  `;
  if (c.nav_eventos?.length) {
    html += `<div class="nav-mobile-group">
      <div class="nav-mobile-group-title">Eventos</div>
      ${c.nav_eventos.map(e => `<a href="eventos.html#${e}">${formatLabel(e)}</a>`).join('')}
    </div>`;
  }
  if (c.nav_espacios?.length) {
    html += `<div class="nav-mobile-group">
      <div class="nav-mobile-group-title">Espacios</div>
      ${c.nav_espacios.map(e => `<a href="espacios.html#${e}">${formatLabel(e)}</a>`).join('')}
    </div>`;
  }
  html += `<a href="contacto.html" class="nav-mobile-cta">Cotizar ahora</a>`;
  return html;
}

function injectFooter() {
  const c = CLIENT_CONFIG;
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.setAttribute('role', 'contentinfo');
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo-text" id="footer-brand-name">${c.nombre}</div>
        <p class="footer-tagline" id="footer-tagline">${c.tagline}</p>
        <div class="footer-socials" id="footer-socials"></div>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Eventos</div>
        <ul class="footer-col-links" id="footer-eventos"></ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Contacto</div>
        <ul class="footer-contact-list" id="footer-contact"></ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy" id="footer-copy"></p>
    </div>
  `;
  document.body.appendChild(footer);
}

function injectFAB() {
  const fab = document.createElement('a');
  fab.className = 'whatsapp-fab';
  fab.id = 'whatsapp-fab';
  fab.href = '#';
  fab.target = '_blank';
  fab.rel = 'noopener';
  fab.setAttribute('aria-label', 'Contactar por WhatsApp');
  fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.558 4.14 1.537 5.878L.057 23.58a.5.5 0 00.614.614l5.702-1.48A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.003-1.374l-.357-.213-3.708.962.983-3.594-.233-.369A9.818 9.818 0 012.182 12C2.182 6.562 6.562 2.182 12 2.182S21.818 6.562 21.818 12 17.438 21.818 12 21.818z"/>
  </svg>`;
  document.body.appendChild(fab);
}

function injectToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
}

export function initShell() {
  injectNavbar();
  injectFooter();
  injectFAB();
  injectToast();

  window.__venueConfig = { CLIENT_CONFIG };

  initConfigLoader();
  initNavbar();
  initWhatsApp();
  initReveal();
}
