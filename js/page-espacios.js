import { initShell } from './shell.js';
import { loadEspacios } from './content-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  await loadEspacios();
});
