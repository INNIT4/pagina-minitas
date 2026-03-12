// Contador animado activado con IntersectionObserver
export function initStats() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    observer.observe(el);
  });
}

function animateStat(el) {
  const target = parseInt(el.dataset.target) || 0;
  const sufijo = el.dataset.sufijo || '';
  const duration = 1200;
  const start = performance.now();

  el.classList.add('counting');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString('es-MX') + sufijo;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
