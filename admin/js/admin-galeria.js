import { db, storage } from '../../js/firebase-config.js';

let selectedFiles = [];

export function initAdminGaleria() {
  const uploadArea  = document.getElementById('upload-area');
  const fileInput   = document.getElementById('file-input');
  const btnUpload   = document.getElementById('btn-upload');
  const placeholder = document.getElementById('upload-placeholder');

  if (!uploadArea) return;

  // Click para abrir selector
  uploadArea.addEventListener('click', () => fileInput?.click());

  // Drag & Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files));
  });

  fileInput?.addEventListener('change', () => {
    handleFiles(Array.from(fileInput.files));
  });

  btnUpload?.addEventListener('click', uploadFiles);

  loadGallery();
}

function handleFiles(files) {
  const valid = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
  if (valid.length !== files.length) {
    showAdminToast('Algunas imágenes superan el límite de 5 MB', 'error');
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

async function uploadFiles() {
  if (!selectedFiles.length || !storage) return;

  const { ref: storageRef, uploadBytes, getDownloadURL } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
  const { collection, addDoc } =
    await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

  const categoria = document.getElementById('upload-categoria')?.value || 'general';
  const progress  = document.getElementById('upload-progress');
  const fill      = document.getElementById('progress-fill');
  const status    = document.getElementById('upload-status');
  const btn       = document.getElementById('btn-upload');

  if (progress) progress.hidden = false;
  if (btn) btn.disabled = true;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const fileName = `gallery/${categoria}/${Date.now()}_${file.name}`;

    try {
      if (status) status.textContent = `Subiendo ${i + 1}/${selectedFiles.length}...`;
      if (fill) fill.style.width = `${Math.round(((i) / selectedFiles.length) * 100)}%`;

      const ref = storageRef(storage, fileName);
      await uploadBytes(ref, file);
      const url = await getDownloadURL(ref);

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
  if (placeholder) placeholder.innerHTML = `<span class="upload-icon">📁</span><p>Haz clic para seleccionar imágenes</p><p class="upload-hint">JPG, PNG, WebP — máx. 5 MB por imagen</p>`;

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
      grid.innerHTML = '<div class="empty-state">No hay fotos en la galería todavía.</div>';
      return;
    }

    grid.innerHTML = snap.docs.map(d => {
      const item = { id: d.id, ...d.data() };
      return `
        <div class="gallery-admin-item" data-id="${item.id}">
          <img src="${item.url}" alt="" loading="lazy">
          <div class="gallery-admin-overlay">
            <button class="a-btn a-btn-danger a-btn-sm" data-delete="${item.id}" data-url="${item.url}">
              Eliminar
            </button>
          </div>
          <span class="gallery-admin-cat">${item.categoria || ''}</span>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => deletePhoto(btn.dataset.delete, btn.dataset.url));
    });

  } catch (err) {
    console.error('Error al cargar galería:', err);
    grid.innerHTML = '<div class="empty-state">Error al cargar la galería.</div>';
  }
}

async function deletePhoto(id, url) {
  if (!confirm('¿Eliminar esta foto de la galería?')) return;

  try {
    const { doc, deleteDoc } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const { ref: storageRef, deleteObject } =
      await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");

    await deleteDoc(doc(db, 'gallery', id));

    // Intentar eliminar de Storage (puede fallar si no es Storage URL)
    try {
      const { getStorage } =
        await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
      const ref = storageRef(storage, url);
      await deleteObject(ref);
    } catch { /* ignorar si no se puede eliminar de Storage */ }

    showAdminToast('Foto eliminada', 'success');
    loadGallery();

  } catch (err) {
    console.error('Error al eliminar foto:', err);
    showAdminToast('Error al eliminar foto', 'error');
  }
}

function showAdminToast(msg, type = '') {
  const toast = document.getElementById('a-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `a-toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
