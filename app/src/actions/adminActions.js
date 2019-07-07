// importamos los paquetes que vamos a utilizar
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { AdminModel } = require('../dataBase/models')

Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

const createToken = (adminData) => {
  const exp = new Date().addDays(2).getTime()
  const payload = {
    _id: adminData._id,
    email: adminData.email,
    name: adminData.name,
    isPrivate: adminData.isPrivate,
    exp
  }

  return jwt.sign(payload, process.env.SECRET)
}

const adminSignUpAction = (adminData) => {
  return new Promise((resolve, reject) => {
    AdminModel.create(adminData).then(admin => {
      console.log("TCL: signupAction -> admin", admin)
      const token = createToken(admin)
      resolve({ token, message: `se ha registrado al usuario ${admin.name}
        como admin` })
    }).catch(reject)
  })
}

const adminLoginAction = (email, password) => {
  return new Promise((resolve, reject) => {
    AdminModel.findOne({ email: email }).then(admin => {
      bcrypt.compare(password, admin.password, (err, isValid) => {
        if (err) reject(err)
        isValid 
          ? resolve({ token: createToken(admin),
                      message: `te has loggeado como admin` })
          : reject({ token:'', message: 'credenciales invalidas'})
      })
    }).catch(err => reject(err))
  })
}

module.exports = { adminLoginAction, adminSignUpAction }
