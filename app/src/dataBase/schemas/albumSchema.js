const mongoose = require('mongoose')

const Schema = mongoose.Schema
const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  year: {
    type: String,
    required: true
  },

  coverPage: {
    type: String
  }
})

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

module.exports = AlbumSchema