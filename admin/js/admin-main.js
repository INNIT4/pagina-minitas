// Entry point del panel admin
import { isConfigured } from '../../js/firebase-config.js';
import { CLIENT_CONFIG } from '../../config/client.js';
import { initAuth, loginWithEmail, logout, translateAuthError } from './admin-auth.js';
import { initAdminCotizaciones } from './admin-cotizaciones.js';
import { initAdminCalendar } from './admin-calendar.js';
import { initAdminTextos } from './admin-textos.js';
import { initAdminGaleria } from './admin-galeria.js';

// Si Firebase no está configurado, redirigir con mensaje
if (!isConfigured) {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;padding:2rem;">
      <div>
        <h1 style="font-size:1.5rem;margin-bottom:1rem;">Firebase no configurado</h1>
        <p style="color:#666">Edita <code>js/firebase-config.js</code> con las credenciales reales de tu proyecto Firebase.</p>
      </div>
    </div>`;
}

// Poblar nombre del salón
document.getElementById('login-salon-name')?.setAttribute('textContent', CLIENT_CONFIG.nombre);
document.querySelectorAll('#login-salon-name, #sidebar-salon-name').forEach(el => {
  el.textContent = CLIENT_CONFIG.nombre;
});

document.addEventListener('DOMContentLoaded', () => {
  // Auth state listener
  initAuth(onLogin, onLogout);

  // Form de login
  document.getElementById('form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = document.getElementById('btn-login');
    const error = document.getElementById('login-error');
    const email = document.getElementById('l-email')?.value.trim();
    const pass  = document.getElementById('l-password')?.value;

    btn.disabled = true;
    btn.textContent = 'Entrando...';
    error.hidden = true;

    try {
      await loginWithEmail(email, pass);
    } catch (err) {
      error.textContent = translateAuthError(err.code);
      error.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => logout());

  // Navegación de secciones
  document.querySelectorAll('.sidebar-link[data-section]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });

  // Sidebar toggle (mobile)
  const sidebar = document.getElementById('sidebar');
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  // Cerrar sidebar al clickear fuera (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 &&
        !sidebar?.contains(e.target) &&
        e.target.id !== 'sidebar-toggle') {
      sidebar?.classList.remove('open');
    }
  });
});

function onLogin(user) {
  document.getElementById('view-login').hidden     = true;
  document.getElementById('view-dashboard').hidden = false;

  const emailEl = document.getElementById('topbar-email');
  if (emailEl) emailEl.textContent = user.email;

  // Inicializar módulos admin
  initAdminCotizaciones();
  initAdminCalendar();
  initAdminTextos();
  initAdminGaleria();

  showSection('cotizaciones');
}

function onLogout() {
  document.getElementById('view-login').hidden     = false;
  document.getElementById('view-dashboard').hidden = true;
}

function showSection(name) {
  // Ocultar todas las secciones
  document.querySelectorAll('.admin-section').forEach(s => s.hidden = true);

  // Mostrar la activa
  const section = document.getElementById(`section-${name}`);
  if (section) section.hidden = false;

  // Actualizar título y sidebar activo
  const titleMap = {
    cotizaciones: 'Cotizaciones',
    calendario:   'Calendario de disponibilidad',
    textos:       'Editar textos',
    galeria:      'Galería de fotos'
  };

  const title = document.getElementById('admin-section-title');
  if (title) title.textContent = titleMap[name] || name;

  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === name);
  });

  // Cerrar sidebar en mobile
  if (window.innerWidth < 768) {
    document.getElementById('sidebar')?.classList.remove('open');
  }
}
