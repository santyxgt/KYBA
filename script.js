// script.js — Keep Your Boat Afloat
// Campañas conectadas al API en lugar de localStorage
//solo maneja canpanas

const API = 'http://localhost:5000/api';

/* ══════════════════════════════════════════
   HELPERS DE FETCH
══════════════════════════════════════════ */

// Arma el header con el token para rutas privadas
function authHeader() {
  const token = localStorage.getItem('kyba_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type':  'application/json'
  };
}

/* ══════════════════════════════════════════
   NAVEGACIÓN ENTRE VISTAS
══════════════════════════════════════════ */

function mostrarVista(vista) {
  document.getElementById('vista-inicio').classList.add('hidden');
  document.getElementById('vista-nosotros').classList.add('hidden');
  document.getElementById('vista-campanas').classList.add('hidden');
  document.getElementById('vista-' + vista).classList.remove('hidden');

  if (vista === 'campanas') renderizar();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════
   IMAGEN — PREVIEW
══════════════════════════════════════════ */

let imagenArchivo = null; // ahora guardamos el archivo, no el base64

function previewImagen(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  imagenArchivo = archivo; // guardamos el archivo para enviarlo al API

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('preview-img');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    document.getElementById('upload-placeholder').classList.add('hidden');
  };
  reader.readAsDataURL(archivo);
}

/* ══════════════════════════════════════════
   MODAL CAMPAÑA
══════════════════════════════════════════ */

function abrirModal() {
  // Si no hay sesión, pedir login primero
  if (!localStorage.getItem('kyba_token')) {
    abrirModalAuth('login');
    return;
  }

  imagenArchivo = null;
  document.getElementById('preview-img').classList.add('hidden');
  document.getElementById('upload-placeholder').classList.remove('hidden');
  document.getElementById('f-imagen').value = '';
  document.getElementById('f-nombre').value = '';
  document.getElementById('f-desc').value   = '';
  document.getElementById('f-meta').value   = '';
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

async function guardarCampana() {
  const nombre      = document.getElementById('f-nombre').value.trim();
  const descripcion = document.getElementById('f-desc').value.trim();
  const meta        = parseFloat(document.getElementById('f-meta').value);

<<<<<<< HEAD
   if (!nombre || !descripcion || !meta || !creador || meta < 100) { {
    alert('Por favor completa todos los campos. La meta mínima es $100.');
=======
  if (!nombre || !descripcion || !meta) {
    alert('Por favor completa todos los campos obligatorios.');
>>>>>>> d583829 (feat: Campañas conectadas al API reemplazando localStorage)
    return;
  }

  try {
    // Usamos FormData porque enviamos un archivo + datos
    const formData = new FormData();
    formData.append('titulo',      nombre);
    formData.append('descripcion', descripcion);
    formData.append('meta',        meta);
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo);
    }

    const res = await fetch(`${API}/campanas`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('kyba_token')}` },
      // ⚠️ No pongas Content-Type aquí — el navegador lo hace solo con FormData
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Error al crear campaña');
      return;
    }

    cerrarModal();
    renderizar();

  } catch (error) {
    alert('No se pudo conectar con el servidor');
  }
}

/* ══════════════════════════════════════════
   RENDERIZAR CAMPAÑAS
══════════════════════════════════════════ */

async function renderizar() {
  const lista = document.getElementById('lista-campanas');
  lista.innerHTML = '<div class="vacio">🌊 Cargando campañas...</div>';

<<<<<<< HEAD
  if (campanas.length === 0) {
  const hayFiltro = document.getElementById('buscador')?.value;
  lista.innerHTML = hayFiltro
    ? '<div class="vacio">🔍 No se encontraron campañas con ese nombre.</div>'
    : '<div class="vacio">🌊 No hay campañas todavía. ¡Crea la primera!</div>';
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
=======
  try {
    const res      = await fetch(`${API}/campanas`);
    const campanas = await res.json();

    if (campanas.length === 0) {
      lista.innerHTML = '<div class="vacio">🌊 No hay campañas todavía. ¡Crea la primera!</div>';
      return;
    }

    lista.innerHTML = campanas.map(c => {
      const pct      = Math.min(100, Math.round((c.monto_recaudado / c.meta) * 100));
      const completa = pct >= 100;

      const imagenHtml = c.imagen
        ? `<img class="card-imagen" src="http://localhost:5000${c.imagen}" alt="${c.titulo}"/>`
        : `<div class="card-imagen-placeholder">⚓</div>`;

      return `
        <div class="campana-card">
          ${imagenHtml}
          <div class="card-body">
            <h3>${c.titulo}</h3>
            <p>${c.descripcion}</p>
            <div class="card-meta">👤 ${c.creador.nombre} &nbsp;|&nbsp; Meta: $${c.meta.toLocaleString()}</div>

            <div class="barra-fondo">
              <div class="barra-fill ${completa ? 'completa' : ''}" style="width:${pct}%"></div>
            </div>
            <div class="pct-texto">
              $${c.monto_recaudado.toLocaleString()} recaudados — ${pct}%
              ${completa ? ' ✅ ¡Meta alcanzada!' : ''}
            </div>

            <div class="card-btns">
              <button class="btn-donar"    onclick="toggleDonar('${c._id}')">💰 Donar</button>
              <button class="btn-eliminar" onclick="eliminar('${c._id}')">🗑</button>
            </div>

            <div class="donate-row" id="donar-${c._id}">
              <input type="number" id="monto-${c._id}" placeholder="Monto $" min="1"/>
              <button class="btn-confirmar"  onclick="donar('${c._id}')">✓</button>
              <button class="btn-cancelar-d" onclick="toggleDonar('${c._id}')">✕</button>
            </div>
          </div>
        </div>`;
    }).join('');

  } catch (error) {
    lista.innerHTML = '<div class="vacio">❌ Error al cargar campañas</div>';
  }
>>>>>>> d583829 (feat: Campañas conectadas al API reemplazando localStorage)
}

/* ══════════════════════════════════════════
   DONAR
══════════════════════════════════════════ */

function toggleDonar(id) {
  document.getElementById('donar-' + id).classList.toggle('open');
}

async function donar(id) {
  const monto = parseFloat(document.getElementById('monto-' + id).value);
  if (!monto || monto <= 0) { alert('Ingresa un monto válido.'); return; }

  try {
    const res = await fetch(`${API}/campanas/${id}/donar`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ monto })
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || 'Error al donar');
      return;
    }

    renderizar();

  } catch (error) {
    alert('No se pudo conectar con el servidor');
  }
}

/* ══════════════════════════════════════════
   ELIMINAR
══════════════════════════════════════════ */

<<<<<<< HEAD
function eliminar(id) {
  if (!confirm('¿Seguro que quieres eliminar esta campaña?')) return;
  const campanas = getCampanas().filter(c => c.id !== id);
  setCampanas(campanas);
  renderizar();
}
=======
async function eliminar(id) {
  if (!confirm('¿Seguro que quieres eliminar esta campaña?')) return;

  try {
    const res = await fetch(`${API}/campanas/${id}`, {
      method:  'DELETE',
      headers: authHeader()
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || 'Error al eliminar');
      return;
    }
>>>>>>> d583829 (feat: Campañas conectadas al API reemplazando localStorage)

    renderizar();

  } catch (error) {
    alert('No se pudo conectar con el servidor');
  }
}

/* ══════════════════════════════════════════
   CERRAR MODAL AL HACER CLIC FUERA
══════════════════════════════════════════ */

<<<<<<< HEAD
const modal = document.getElementById('modal');

document.getElementById('modal').addEventListener('click', function (e) {
=======
document.getElementById('modal').addEventListener('click', function(e) {
>>>>>>> d583829 (feat: Campañas conectadas al API reemplazando localStorage)
  if (e.target === this) cerrarModal();
});