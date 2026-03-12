import { db, isConfigured } from './firebase-config.js';
import { CLIENT_CONFIG } from '../config/client.js';

export function initQuoteForm() {
  const btnWA    = document.getElementById('btn-whatsapp-quote');
  const btnEmail = document.getElementById('btn-email-quote');

  btnWA?.addEventListener('click', () => handleSubmit('whatsapp'));
  btnEmail?.addEventListener('click', () => handleSubmit('email'));

  // Fecha mínima: hoy
  const fechaInput = document.getElementById('q-fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }
}

function handleSubmit(channel) {
  if (!validateForm()) return;

  const data = getFormData();

  if (channel === 'whatsapp') sendWhatsApp(data);
  else sendEmail(data);

  saveToFirestore(data);
  showToast('¡Cotización enviada! Te contactaremos pronto.', 'success');
}

function validateForm() {
  let valid = true;
  const fields = [
    { id: 'q-nombre',   errId: 'err-nombre',   check: v => v.trim().length >= 2 },
    { id: 'q-telefono', errId: 'err-telefono',  check: v => /^\d[\d\s\-]{7,}$/.test(v.trim()) },
    { id: 'q-tipo',     errId: 'err-tipo',      check: v => v !== '' },
    { id: 'q-fecha',    errId: 'err-fecha',     check: v => v !== '' },
    { id: 'q-personas', errId: 'err-personas',  check: v => parseInt(v) > 0 }
  ];

  fields.forEach(({ id, errId, check }) => {
    const input = document.getElementById(id);
    const err   = document.getElementById(errId);
    if (!input || !err) return;

    const ok = check(input.value);
    input.classList.toggle('error', !ok);
    err.classList.toggle('visible', !ok);
    if (!ok) valid = false;
  });

  return valid;
}

function getFormData() {
  return {
    nombre:      document.getElementById('q-nombre')?.value.trim() || '',
    telefono:    document.getElementById('q-telefono')?.value.trim() || '',
    tipo_evento: document.getElementById('q-tipo')?.value || '',
    fecha:       document.getElementById('q-fecha')?.value || '',
    personas:    document.getElementById('q-personas')?.value || '',
    mensaje:     document.getElementById('q-mensaje')?.value.trim() || '',
    timestamp:   new Date().toISOString(),
    leido:       false
  };
}

function sendWhatsApp(data) {
  const text = [
    `*Solicitud de cotización – ${CLIENT_CONFIG.nombre}*`,
    ``,
    `👤 *Nombre:* ${data.nombre}`,
    `📞 *Teléfono:* ${data.telefono}`,
    `🎉 *Tipo de evento:* ${capitalize(data.tipo_evento)}`,
    `📅 *Fecha:* ${formatDate(data.fecha)}`,
    `👥 *Personas:* ${data.personas}`,
    data.mensaje ? `💬 *Mensaje:* ${data.mensaje}` : ''
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${CLIENT_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function sendEmail(data) {
  const subject = `Cotización de evento – ${capitalize(data.tipo_evento)} – ${data.fecha}`;
  const body = [
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
    `Tipo de evento: ${capitalize(data.tipo_evento)}`,
    `Fecha tentativa: ${formatDate(data.fecha)}`,
    `Número de personas: ${data.personas}`,
    ``,
    `Mensaje:`,
    data.mensaje || '(sin mensaje adicional)'
  ].join('\n');

  window.location.href = `mailto:${CLIENT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function saveToFirestore(data) {
  if (!isConfigured) return;
  try {
    const { collection, addDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await addDoc(collection(db, 'cotizaciones'), data);
  } catch (err) {
    console.warn('No se pudo guardar la cotización en Firestore:', err);
  }
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4000);
}
