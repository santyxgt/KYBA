/* ============================================================
   script.js — Keep Your Boat Afloat
   localStorage: getItem | setItem | removeItem
   Imagen: se convierte a base64 para poder guardarla como string
   ============================================================ */

const LS_KEY = 'kyba_campanas';

/* ── Imagen en base64 (se guarda temporalmente al seleccionarla) ── */
let imagenBase64 = null;

/* ══════════════════════════════════════════
   NAVEGACIÓN ENTRE VISTAS
   ══════════════════════════════════════════ */

/**
 * Muestra la vista indicada y oculta las demás.
 * @param {string} vista - 'inicio' | 'nosotros' | 'campanas'
 */
function mostrarVista(vista) {
  document.getElementById('vista-inicio').classList.add('hidden');
  document.getElementById('vista-nosotros').classList.add('hidden');
  document.getElementById('vista-campanas').classList.add('hidden');

  document.getElementById('vista-' + vista).classList.remove('hidden');

  /* Si se navega a campañas, renderizar la lista */
  if (vista === 'campanas') {
    renderizar();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════
   localStorage HELPERS
   ══════════════════════════════════════════ */

function getCampanas() {
  const data = localStorage.getItem(LS_KEY);   // getItem
  return data ? JSON.parse(data) : [];
}

function setCampanas(campanas) {
  localStorage.setItem(LS_KEY, JSON.stringify(campanas));  // setItem
}

function borrarCampanas() {
  localStorage.removeItem(LS_KEY);   // removeItem
}

/* ══════════════════════════════════════════
   IMAGEN — PREVIEW Y BASE64
   ══════════════════════════════════════════ */

/**
 * Al seleccionar un archivo de imagen:
 * 1. Muestra la previsualización en el modal.
 * 2. Convierte la imagen a base64 para poder guardarla en localStorage.
 */
function previewImagen(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    imagenBase64 = e.target.result;   // string base64 → se guardará en localStorage

    /* Mostrar preview y ocultar el placeholder */
    const preview = document.getElementById('preview-img');
    preview.src = imagenBase64;
    preview.classList.remove('hidden');
    document.getElementById('upload-placeholder').classList.add('hidden');
  };

  reader.readAsDataURL(archivo);   // convierte el archivo a base64
}

/* ══════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════ */

function abrirModal() {
  imagenBase64 = null;
  document.getElementById('preview-img').classList.add('hidden');
  document.getElementById('upload-placeholder').classList.remove('hidden');
  document.getElementById('f-imagen').value  = '';
  document.getElementById('f-nombre').value  = '';
  document.getElementById('f-desc').value    = '';
  document.getElementById('f-meta').value    = '';
  document.getElementById('f-creador').value = '';
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('f-desc').addEventListener('input', function () {
  document.getElementById('desc-contador').textContent =
    this.value.length + ' / 150 caracteres';
});
}

function cerrarModal() {
  document.getElementById('modal').classList.add('hidden');
}

/* ══════════════════════════════════════════
   CREAR CAMPAÑA
   ══════════════════════════════════════════ */

function guardarCampana() {
  const nombre      = document.getElementById('f-nombre').value.trim();
  const descripcion = document.getElementById('f-desc').value.trim();
  const meta        = parseFloat(document.getElementById('f-meta').value);
  const creador     = document.getElementById('f-creador').value.trim();

  if if (!nombre || !descripcion || !meta || !creador || meta < 100) { {
    alert('Por favor completa todos los campos. La meta mínima es $100.');
    return;
  }

  const nueva = {
    id:          'c' + Date.now(),
    nombre,
    descripcion,
    meta,
    creador,
    recaudado:   0,
    imagen:      imagenBase64   // puede ser null si no subieron imagen
  };

  const campanas = getCampanas();
  campanas.unshift(nueva);
  setCampanas(campanas);   // setItem — guarda incluyendo la imagen en base64

  cerrarModal();
  renderizar();
}

/* ══════════════════════════════════════════
   RENDERIZAR CAMPAÑAS
   ══════════════════════════════════════════ */

function renderizar() {
  const lista    = document.getElementById('lista-campanas');
  const campanas = getCampanas();

  if (campanas.length === 0) {
    lista.innerHTML = '<div class="vacio">🌊 No hay campañas todavía. ¡Crea la primera!</div>';
    return;
   
  }

  lista.innerHTML = campanas.map(c => {
    const pct      = Math.min(100, Math.round((c.recaudado / c.meta) * 100));
    const completa = pct >= 100;

    /* Si tiene imagen la muestra, si no muestra un ícono */
    const imagenHtml = c.imagen
      ? `<img class="card-imagen" src="${c.imagen}" alt="${c.nombre}"/>`
      : `<div class="card-imagen-placeholder">⚓</div>`;

    return `
      <div class="campana-card">
        ${imagenHtml}
        <div class="card-body">
          <h3>${c.nombre}</h3>
          <p>${c.descripcion}</p>
          <div class="card-meta">👤 ${c.creador} &nbsp;|&nbsp; Meta: $${c.meta.toLocaleString()}</div>

          <div class="barra-fondo">
            <div class="barra-fill ${completa ? 'completa' : ''}" style="width:${pct}%"></div>
          </div>
          <div class="pct-texto">
            $${c.recaudado.toLocaleString()} recaudados — ${pct}%
            ${completa ? ' ✅ ¡Meta alcanzada!' : ''}
          </div>

          <div class="card-btns">
            <button class="btn-donar" onclick="toggleDonar('${c.id}')">💰 Donar</button>
            <button class="btn-eliminar" onclick="eliminar('${c.id}')">🗑</button>
          </div>

          <div class="donate-row" id="donar-${c.id}">
            <input type="number" id="monto-${c.id}" placeholder="Monto $" min="1"/>
            <button class="btn-confirmar" onclick="donar('${c.id}')">✓</button>
            <button class="btn-cancelar-d" onclick="toggleDonar('${c.id}')">✕</button>
          </div>
        </div>
      </div>`;
  }).join('');
  document.getElementById('contador-campanas').textContent = campanas.length;
}

/* ══════════════════════════════════════════
   DONAR
   ══════════════════════════════════════════ */

function toggleDonar(id) {
  document.getElementById('donar-' + id).classList.toggle('open');
}

function donar(id) {
  const monto = parseFloat(document.getElementById('monto-' + id).value);
  if (!monto || monto <= 0) { alert('Ingresa un monto válido.'); return; }

  const campanas = getCampanas();
  const idx = campanas.findIndex(c => c.id === id);
  if (idx === -1) return;

  campanas[idx].recaudado += monto;
  setCampanas(campanas);   // setItem
  renderizar();
}

/* ══════════════════════════════════════════
   ELIMINAR / LIMPIAR
   ══════════════════════════════════════════ */

function eliminar(id) {
  const campanas = getCampanas().filter(c => c.id !== id);
  setCampanas(campanas);   // setItem
  renderizar();
}

function limpiarTodo() {
  if (confirm('¿Seguro que quieres eliminar todas las campañas?')) {
    borrarCampanas();   // removeItem
    renderizar();
  }
}

/* ══════════════════════════════════════════
   CERRAR MODAL AL HACER CLIC FUERA
   ══════════════════════════════════════════ */

document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) cerrarModal();
});