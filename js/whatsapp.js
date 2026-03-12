import { CLIENT_CONFIG } from '../config/client.js';

export function initWhatsApp() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab) return;

  const msg = encodeURIComponent(CLIENT_CONFIG.whatsapp_mensaje);
  fab.href = `https://wa.me/${CLIENT_CONFIG.whatsapp}?text=${msg}`;
}
