const mongoose = require('mongoose')

const Schema = mongoose.Schema
const songSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  source: {
    type: String,
    required: true
  },

  duration: {
    type: String
  },

  picture: {
    type: String
  }
})

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

module.exports = songSchema
