import { initShell } from './shell.js';
import { loadNosotros, loadTestimonios } from './content-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  await Promise.all([loadNosotros(), loadTestimonios()]);
});
