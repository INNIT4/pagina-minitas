import { initShell } from './shell.js';
import { initHero } from './hero.js';
import { initStats } from './stats.js';
import { initPopup } from './popup.js';
import { initFaq } from './faq.js';
import { loadHero, loadNosotros, loadStats, loadEventos, loadTestimonios, loadFaq, loadPaquetes } from './content-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  initHero();

  await Promise.all([
    loadHero(),
    loadNosotros(),
    loadStats(),
    loadEventos(),
    loadTestimonios(),
    loadFaq(),
    loadPaquetes()
  ]);

  initStats();
  initFaq();
  initPopup().catch(console.warn);
});
