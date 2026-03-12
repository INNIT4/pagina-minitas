import { initShell } from './shell.js';
import { loadEventos } from './content-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  await loadEventos();
});
