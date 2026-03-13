import { db } from '../../js/firebase-config.js';
import { CLIENT_CONFIG } from '../../config/client.js';

const DEFAULT_CATEGORIAS = ['bodas', 'xv', 'bautizos', 'empresariales'];
let selectedFiles = [];

export function initAdminGaleria() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput  = document.getElementById('file-input');
  const btnUpload  = document.getElementById('btn-upload');

  if (!uploadArea) return;

  uploadArea.addEventListener('click', () => fileInput?.click());
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });

  fileInput?.addEventListener('change', () => handleFiles(Array.from(fileInput.files)));
  btnUpload?.addEventListener('click', uploadFiles);

  // UI de nueva categoría
  const btnAdd      = document.getElementById('btn-add-categoria');
  const wrap        = document.getElementById('nueva-categoria-wrap');
  const input       = document.getElementById('nueva-categoria-input');
  const btnConfirm  = document.getElementById('btn-confirmar-categoria');
  const btnCancel   = document.getElementById('btn-cancelar-categoria');

  btnAdd?.addEventListener('click', () => {
    wrap.hidden = false;
    input.focus();
  });

  btnCancel?.addEventListener('click', () => {
    wrap.hidden = true;
    input.value = '';
  });

  btnConfirm?.addEventListener('click', () => agregarCategoria());
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') agregarCategoria(); });

  loadCategorias();
  loadGallery();
}

async function loadCategorias() {
  const select = document.getElementById('upload-categoria');
  if (!select) return;

  let cats = [...DEFAULT_CATEGORIAS];

  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDoc(doc(db, 'config', 'gallery_categorias'));
    if (snap.exists() && snap.data().categorias?.length) {
      cats = snap.data().categorias;
    }
  } catch { /* usa defaults */ }

  renderCategorias(cats);
}

function renderCategorias(cats) {
  const select = document.getElementById('upload-categoria');
  if (!select) return;
  select.innerHTML = cats.map(c =>
    `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, ' ')}</option>`
  ).join('');
}

async function agregarCategoria() {
  const input = document.getElementById('nueva-categoria-input');
  const wrap  = document.getElementById('nueva-categoria-wrap');
  const select = document.getElementById('upload-categoria');
  if (!input || !select) return;

  const nombre = input.value.trim().toLowerCase().replace(/\s+/g, '-');
  if (!nombre) return;

  // Evitar duplicados
  const existe = Array.from(select.options).some(o => o.value === nombre);
  if (existe) {
    select.value = nombre;
    wrap.hidden = true;
    input.value = '';
    return;
  }

  // Agregar al select
  const cats = Array.from(select.options).map(o => o.value).concat(nombre);
  renderCategorias(cats);
  select.value = nombre;
  wrap.hidden = true;
  input.value = '';

  // Persistir en Firestore
  try {
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await setDoc(doc(db, 'config', 'gallery_categorias'), { categorias: cats });
  } catch (err) {
    console.warn('No se pudo guardar la categoría en Firestore:', err);
  }
}

function handleFiles(files) {
  const valid = files.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
  if (valid.length !== files.length) {
    showAdminToast('Algunas imágenes superan el límite de 10 MB', 'error');
  }
  selectedFiles = valid;

  const placeholder = document.getElementById('upload-placeholder');
  const btn = document.getElementById('btn-upload');

  if (placeholder) {
    placeholder.innerHTML = valid.length > 0
      ? `<span class="upload-icon">✅</span><p>${valid.length} imagen(es) seleccionada(s)</p>`
      : `<span class="upload-icon">📁</span><p>Haz clic para seleccionar imágenes</p>`;
  }
  if (btn) btn.disabled = valid.length === 0;
}

async function uploadToCloudinary(file, categoria) {
  const { cloud_name, upload_preset } = CLIENT_CONFIG.cloudinary;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', upload_preset);
  formData.append('folder', `elmarques/${categoria}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error(`Cloudinary error: ${res.status}`);
  const data = await res.json();
  return data.secure_url;
}

async function uploadFiles() {
  if (!selectedFiles.length) return;

  const { cloud_name, upload_preset } = CLIENT_CONFIG.cloudinary;
  if (cloud_name.startsWith('REEMPLAZA') || upload_preset.startsWith('REEMPLAZA')) {
    showAdminToast('Configura Cloudinary en config/client.js primero', 'error');
    return;
  }

  const categoria = document.getElementById('upload-categoria')?.value || 'general';
  const progress  = document.getElementById('upload-progress');
  const fill      = document.getElementById('progress-fill');
  const status    = document.getElementById('upload-status');
  const btn       = document.getElementById('btn-upload');

  if (progress) progress.hidden = false;
  if (btn) btn.disabled = true;

  const { collection, addDoc } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    try {
      if (status) status.textContent = `Subiendo ${i + 1}/${selectedFiles.length}...`;
      if (fill) fill.style.width = `${Math.round((i / selectedFiles.length) * 100)}%`;

      const url = await uploadToCloudinary(file, categoria);

      await addDoc(collection(db, 'gallery'), {
        url,
        categoria,
        orden: Date.now() + i,
        nombre: file.name
      });

    } catch (err) {
      console.error(`Error al subir ${file.name}:`, err);
      showAdminToast(`Error al subir ${file.name}`, 'error');
    }
  }

  if (fill) fill.style.width = '100%';
  if (status) status.textContent = 'Completado';

  selectedFiles = [];
  if (btn) btn.disabled = true;
  const placeholder = document.getElementById('upload-placeholder');
  if (placeholder) placeholder.innerHTML = `<span class="upload-icon">📁</span><p>Haz clic para seleccionar imágenes</p><p class="upload-hint">JPG, PNG, WebP — máx. 10 MB por imagen</p>`;

  showAdminToast('Fotos subidas correctamente', 'success');
  setTimeout(() => { if (progress) progress.hidden = true; }, 2000);

  loadGallery();
}

async function loadGallery() {
  const grid = document.getElementById('gallery-admin-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-state">Cargando galería...</div>';

  try {
    const { collection, getDocs, orderBy, query } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const snap = await getDocs(query(collection(db, 'gallery'), orderBy('orden', 'desc')));

    if (snap.empty) {
      grid.innerHTML = '<div class="empty-state">No hay fotos todavía.</div>';
      return;
    }

    grid.innerHTML = snap.docs.map(d => {
      const item = { id: d.id, ...d.data() };
      return `
        <div class="gallery-admin-item" data-id="${item.id}">
          <img src="${item.url}" alt="" loading="lazy">
          <div class="gallery-admin-overlay">
            <button class="a-btn a-btn-danger a-btn-sm" data-delete="${item.id}">Eliminar</button>
          </div>
          <span class="gallery-admin-cat">${item.categoria || ''}</span>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deletePhoto(btn.dataset.delete));
    });

  } catch (err) {
    console.error('Error al cargar galería:', err);
    grid.innerHTML = '<div class="empty-state">Error al cargar la galería.</div>';
  }
}

async function deletePhoto(id) {
  if (!confirm('¿Eliminar esta foto?')) return;
  try {
    const { doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await deleteDoc(doc(db, 'gallery', id));
    showAdminToast('Foto eliminada', 'success');
    loadGallery();
  } catch (err) {
    console.error('Error al eliminar:', err);
    showAdminToast('Error al eliminar', 'error');
  }
}

function showAdminToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `a-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
