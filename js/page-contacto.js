import { initShell } from './shell.js';
import { initQuoteForm } from './quote-form.js';
import { initFaq } from './faq.js';
import { loadFaq } from './content-loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  initShell();
  initQuoteForm();
  await loadFaq();
  initFaq();
});
