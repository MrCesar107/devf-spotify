const mongoose = require('mongoose')

const Schema = mongoose.Schema
const AlbumSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  year: {
    type: String,
    required: true
  },

  coverPage: {
    type: String
  },

  songs: [{
    type: Schema.Types.ObjectId,
    ref: "songs"
  }]
})

mongoose.Types.ObjectId.prototype.valueOf = function() {
  return this.toString()
}

module.exports = AlbumSchema