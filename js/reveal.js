// Reveal on scroll usando IntersectionObserver
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Observar elementos existentes y futuros (content-loader los agrega al DOM)
  const observeAll = () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  };

  observeAll();

  // Re-observar después de que content-loader renderice contenido dinámico
  const mutationObserver = new MutationObserver(observeAll);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}
