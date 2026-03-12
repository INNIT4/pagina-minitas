import { initShell } from './shell.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  await initGallery();
});
