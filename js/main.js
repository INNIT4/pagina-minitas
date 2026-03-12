// Entry point del sitio de eventos
// Importa y conecta todos los módulos en el orden correcto

import { CLIENT_CONFIG } from '../config/client.js';
import { initConfigLoader } from './config-loader.js';
import { initNavbar } from './navbar.js';
import { initHero } from './hero.js';
import { initWhatsApp } from './whatsapp.js';
import { loadContent } from './content-loader.js';
import { initGallery } from './gallery.js';
import { initCalendar } from './calendar.js';
import { initQuoteForm } from './quote-form.js';
import { initStats } from './stats.js';
import { initFaq } from './faq.js';
import { initPopup } from './popup.js';
import { initReveal } from './reveal.js';

// Exponer config globalmente para navbar.js (mobile nav)
window.__venueConfig = { CLIENT_CONFIG };

document.addEventListener('DOMContentLoaded', async () => {
  // Fase 1: aplicar configuración del cliente (CSS variables + SEO)
  initConfigLoader();

  // Fase 2: interactividad base
  initNavbar();
  initHero();
  initWhatsApp();

  // Fase 3: contenido dinámico (Firestore + fallback estático)
  await loadContent();

  // Fase 4: features interactivos (después del DOM dinámico)
  initStats();
  initFaq();
  initCalendar();
  initQuoteForm();
  initReveal();
  await initGallery();

  // Popup (sin bloquear el resto)
  initPopup().catch(console.warn);
});
