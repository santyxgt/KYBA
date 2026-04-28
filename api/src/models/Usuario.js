const moongose = require("mongoose");
//modulo : moongose
//required: este campo es obligatorio si no viene la peticion falla 
//unique: no pueden existir dos usuarios con el mismo email
//trim: elimina espacios en blanco al inicio y al final
//lowercase: guarda siempre el email en minisculas
//enum: el rol puede ser usuario o admin ningun otro valor 
//timestamps MongoDB agrega automaticamente createdAt y updateAt a cada documento
//module.exports exporta el modelo para poder usarlo desde otros archivos 
const usuarioSchema = new moongose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },
  },
  {
    timestamps: true,
  },

 // las validaciones son las reglas que le pusimos al sistema 
)
//                    nombre de la coleccion(tabla)
//               cada que se guarda un usuario se crea un registro(fila)
//              desde cualquier archivo se puede importar el modelo y hacer operaciones con el 
//Ejemplo de llamar modelo const Usuario = require('../models/Usuario')
module.exports = moongose.model("Usuario", usuarioSchema)
