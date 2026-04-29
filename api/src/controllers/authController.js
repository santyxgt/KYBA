const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTRO
const registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el email ya existe
        const usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        }

        //*Encriptar la contraseña con bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);
        //se encripta y la passwordEncriptada pasa a ser la password que se guarda en la bda con el usuario
        //*Crear el usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordEncriptada,
            rol,
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" });
        }

        //*Comparar la contraseña con bcrypt

        //aca se compara con la password que se escribio y la consulta de la bda    (usuario.password) (la encriptada)
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ mensaje: "Credenciales incorrectas" });
        }

        //*Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol }, // payload: info que se quiere guardar dentro del token
            // esto no es secreto, cualquiera puede leerlo, pero no puede modificarlo 
            process.env.JWT_SECRET,  // secret: es la clave con la que se firma el token. Está en el .env como JWT_SECRET. 
            // Si alguien intenta modificar el token sin conocer esta clave, la verificación falla.
            { expiresIn: "24h" },  // opciones: configuración extra del token. En este caso expiresIn: '24h' 
            // significa que el token expira después de 24 horas y el usuario tendrá que volver a hacer login.
        );

        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
};



module.exports = { registro, login };
