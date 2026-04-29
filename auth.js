const API = 'http://localhost:3000/api';
//ESTO MANEJA SOLO SESION 
/* ══════════════════════════════════════════
   TOKEN HELPERS
══════════════════════════════════════════ */

function guardarToken(token, nombre) {
  localStorage.clear(); // limpia cualquier sesión anterior
  localStorage.setItem('kyba_token', token);
  localStorage.setItem('kyba_nombre', nombre);
}

function obtenerToken() {
    return localStorage.getItem('kyba_token');
}

function cerrarSesion() {
    localStorage.removeItem('kyba_token');
    localStorage.removeItem('kyba_nombre');
    actualizarNavbar();
}

/* ══════════════════════════════════════════
   NAVBAR — mostrar según estado de sesión
══════════════════════════════════════════ */

function actualizarNavbar() {
    const token = obtenerToken();
    const nombre = localStorage.getItem('kyba_nombre');

    if (token) {
        document.getElementById('nav-auth').classList.add('hidden');
        document.getElementById('nav-usuario').classList.remove('hidden');
        document.getElementById('nav-nombre').textContent = '👤 ' + nombre;
    } else {
        document.getElementById('nav-auth').classList.remove('hidden');
        document.getElementById('nav-usuario').classList.add('hidden');
    }
}

/* ══════════════════════════════════════════
   MODAL AUTH
══════════════════════════════════════════ */

function abrirModalAuth(tab) {
    switchTab(tab);
    document.getElementById('modal-auth').classList.remove('hidden');
}

function cerrarModalAuth() {
    document.getElementById('modal-auth').classList.add('hidden');
    limpiarErrores();
}

function switchTab(tab) {
    // Tabs
    document.getElementById('tab-login').classList.toggle('activo', tab === 'login');
    document.getElementById('tab-registro').classList.toggle('activo', tab === 'registro');

    // Formularios
    document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
    document.getElementById('form-registro').classList.toggle('hidden', tab !== 'registro');

    limpiarErrores();
}

function limpiarErrores() {
    ['login-error', 'reg-error'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = '';
        el.classList.add('hidden');
    });
}

function mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    el.textContent = mensaje;
    el.classList.remove('hidden');
}

/* ══════════════════════════════════════════
   REGISTRO
══════════════════════════════════════════ */

async function registro() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!nombre || !email || !password) {
        mostrarError('reg-error', 'Todos los campos son obligatorios');
        return;
    }
    if (password.length < 6) {
        mostrarError('reg-error', 'La contraseña debe tener mínimo 6 caracteres');
        return;
    }

    try {
        const res = await fetch(`${API}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            mostrarError('reg-error', data.message || 'Error al registrarse');
            return;
        }

        // Registro exitoso → guardar token y cerrar
        guardarToken(data.token, nombre);
        actualizarNavbar();
        cerrarModalAuth();

    } catch (error) {
        mostrarError('reg-error', 'No se pudo conectar con el servidor');
    }
}

/* ══════════════════════════════════════════
   LOGIN
══════════════════════════════════════════ */

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        mostrarError('login-error', 'Todos los campos son obligatorios');
        return;
    }

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            mostrarError('login-error', data.message || 'Credenciales incorrectas');
            return;
        }

        guardarToken(data.token, data.usuario.nombre);
        actualizarNavbar();
        cerrarModalAuth();

    } catch (error) {
        mostrarError('login-error', 'No se pudo conectar con el servidor');
    }
}

/* ══════════════════════════════════════════
   INIT — al cargar la página
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', actualizarNavbar);