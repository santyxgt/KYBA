const express = require('express')
const router = express.Router()
//las constantes registro y login trabajan con como se definieron en authController
const { registro, login } = require('../controllers/authController')

// POST /auth/registro → llama la función registro del controlador
router.post('/registro', registro)

// POST /auth/login → llama la función login del controlador
router.post('/login', login)

module.exports = router