const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true
  }
});

// Convierte el id en string
mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString();
}

UserSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, function (error, salt) {
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) return next(error);
      user.password = hash;
      next();
    })
  })
});

module.exports = UserSchema;
