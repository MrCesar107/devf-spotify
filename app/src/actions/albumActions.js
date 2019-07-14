const { AlbumModel } = require('../../src/dataBase/models')

const createAlbumAction = (albumData) => {
  return new Promise((resolve, reject) => {
    AlbumModel.create(albumData).then((album) => {
      resolve({album, message: "El album ha sido creado satisfactoriamente :)"})
    }).catch(err => reject(err))
  })
}

const addSongToAlbumAction = (songData, albumData) => {
  console.log(songData)
  return new Promise((resolve, reject) => {
    AlbumModel.findByIdAndUpdate(
      albumData._id,
      { $push: { songs: songData.song._id } },
      { new: true }
    ).exec().then(() => {
      resolve({message: 'Se ha creado la cancion con exito'})
    }).catch(err => reject(err))
  })
}

module.exports = { createAlbumAction, addSongToAlbumAction }