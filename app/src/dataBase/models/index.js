const mongoose = require('mongoose')
const UserSchema = require('../schemas/userSchema')

const UserModel = module.exports = mongoose.model('user', UserSchema)

module.exports = {
  UserModel,
}