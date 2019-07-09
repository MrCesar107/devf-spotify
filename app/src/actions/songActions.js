const { SongModel } = require('../dataBase/models')

const createSongAction =  (songData) => {
  return new Promise((resolve, reject) => {
    SongModel.create(songData).then((song) => {
      resolve({ song, message: "La cancion se ha subido con exito :)" })
    }).catch(err => reject(err))
  })
}

module.exports = { createSongAction }
