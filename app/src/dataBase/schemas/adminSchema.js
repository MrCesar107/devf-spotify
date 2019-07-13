const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const AdminSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  isPrivate: {
    type: Boolean,
    required: true
  },

  artists: [{
    type: Schema.Types.ObjectId,
    ref: 'artists'
  }]
}, {timestamps: true})

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

AdminSchema.pre("save", function(next) {
  let admin = this
  if(!admin.isModified("password")) { return next() }
  bcrypt.genSalt(10, function(error, salt) {
    bcrypt.hash(admin.password, salt, function(error, hash) {
      if (error) return next(error)
      admin.password = hash
      next()
    })
  })
})

module.exports = AdminSchema
