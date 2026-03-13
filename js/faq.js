// Accordion FAQ — se ejecuta después de que content-loader renderiza los items
export function initFaq() {
  ['faq-list', 'faq-list-index'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      const btn = e.target.closest('.faq-question');
      if (!btn) return;

      const isOpen = btn.classList.contains('open');
      const faqId  = btn.dataset.faq;
      const answer = document.getElementById(`faq-answer-${faqId}`);

      document.querySelectorAll('.faq-question.open').forEach(q => {
        q.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
        document.getElementById(`faq-answer-${q.dataset.faq}`)?.classList.remove('open');
      });

      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer?.classList.add('open');
      }
    });
  });
}
