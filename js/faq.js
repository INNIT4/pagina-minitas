// Accordion FAQ — se ejecuta después de que content-loader renderiza los items
export function initFaq() {
  // Delegación de eventos: funciona incluso cuando se agrega el HTML dinámicamente
  document.getElementById('faq-list')?.addEventListener('click', e => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const isOpen = btn.classList.contains('open');
    const faqId  = btn.dataset.faq;
    const answer = document.getElementById(`faq-answer-${faqId}`);

    // Cerrar todos los abiertos
    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
      const id = q.dataset.faq;
      document.getElementById(`faq-answer-${id}`)?.classList.remove('open');
    });

    // Abrir el clickeado (si no estaba abierto)
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer?.classList.add('open');
    }
  });
}
