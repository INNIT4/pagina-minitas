import { CLIENT_CONFIG } from '../config/client.js';

export function initHero() {
  const videoId = CLIENT_CONFIG.hero_video_id;
  const heroBg  = document.getElementById('hero-bg');
  const heroImg = document.getElementById('hero-img');

  if (videoId && heroBg) {
    // Reemplazar imagen por iframe de YouTube (autoplay, muted, loop)
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&playsinline=1`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.setAttribute('aria-hidden', 'true');

    // Escalar iframe para cubrir el hero (YouTube solo carga 16:9)
    Object.assign(iframe.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '177.78vh',   // 16/9 * 100vh
      minWidth: '100%',
      height: '56.25vw',   // 9/16 * 100vw
      minHeight: '100%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      border: 'none'
    });

    if (heroImg) heroImg.remove();
    heroBg.appendChild(iframe);
  }
  // Si no hay video, el <img hero-fallback> ya está en el HTML
}
