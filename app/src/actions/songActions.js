const { SongModel } = require('../dataBase/models')

const createSongAction =  (songData) => {
  return new Promise((resolve, reject) => {
    SongModel.create(songData).then((song) => {
      resolve({ song, message: "La cancion se ha subido con exito :)" })
    }).catch(err => reject(err))
  })
}

const updateSongAction = (song, songData) => {
  return new Promise((resolve, reject) => {
    SongModel.findByIdAndUpdate(
      song,
      {
        name: songData.name,
        artist: songData.artist,
        source: songData.source,
        duration: songData.duration
      }
    ).exec().then(() => {
      resolve({message: "La cancion fue actualizada"})
    }).catch(err => reject(err))
  })
}

const deleteSongAction = (song) => {
  return new Promise((resolve, reject) => {
    SongModel.findByIdAndDelete(song).exec().then(() => {
      resolve({message: "La cancion fue eliminada"})
    }).catch(err => reject(err))
  })
}

module.exports = {
  createSongAction,
  updateSongAction,
  deleteSongAction
}
