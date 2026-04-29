// src/routes/usuarioRoutes.js

const express    = require('express');
const router     = express.Router();
const { subirFotoPerfil, obtenerPerfil } = require('../controllers/usuarioController');
const verifyToken = require('../middlewares/verifyToken');
const upload      = require('../middlewares/upload');

// Todas privadas — requieren estar logueado
router.get('/perfil',      verifyToken, obtenerPerfil);
router.post('/foto',       verifyToken, upload.single('foto'), subirFotoPerfil);

module.exports = router;