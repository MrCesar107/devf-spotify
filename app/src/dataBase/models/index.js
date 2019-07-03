// importamos los paquetes que vamos a utilizar
const mongoose = require('mongoose')

//importamos los esquemas
const UserSchema = require('../schemas/userSchema')
const AdminSchema = require('../schemas/adminSchema')

// creacion de modelos, crea un modelo con el nombre de la coleccion y el
// esquema
const UserModel = mongoose.model("users", UserSchema)
const AdminModel = mongoose.model("admins", AdminSchema)

// exportamos los objetos de los modelos
module.exports = { UserModel, AdminModel }