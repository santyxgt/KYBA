//el index js es el punto de entrada de toda la API cuando corremos "npm run dev" node empieza a leer desde ahi
// Importar Express y crear el servidor
// Configurar middlewares globales (como cors y que entienda JSON)
// Conectarse a MongoDB
// Poner el servidor a escuchar en un puerto

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./src/routes/authRoutes')
const campanasRoutes = require('./src/routes/campanasRoutes')
const usuarioRoutes  = require('./src/routes/usuarioRoutes');
const cors = require("cors");
require("dotenv").config();
//crea aplicacion express

const app = express();
//middlewares globales

app.use(cors());
app.use(express.json());
//*le dice a Express que si vienen preguntando por /auth lo manda a /authRoutes
app.use('/auth', authRoutes)
app.use('/api/campanas', campanasRoutes);
//*esto es para que las imagenes sean accesibles por link nose xd
app.use('/uploads', express.static('uploads'));

app.use('/api/usuarios', usuarioRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Keep Your Boat Afloat funcionando" });
});

//conexion a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    //iniciar el server solo si la bd se logro Conectar
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Servidor corriendo en el puerto ${process.env.PORT} || 3000`,
      );
    });
  })
  .catch((error) => {
    console.error("Error conectando a MongoDB: ", error);
  });
