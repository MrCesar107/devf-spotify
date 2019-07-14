const { AlbumModel } = require('../../src/dataBase/models')

const createAlbumAction = (albumData) => {
  return new Promise((resolve, reject) => {
    AlbumModel.create(albumData).then((album) => {
      resolve({album, message: "El album ha sido creado satisfactoriamente :)"})
    }).catch(err => reject(err))
  })
}

const updateAlbumAction = (album, albumData) => {
  return new Promise((resolve, reject) => {
    AlbumModel.findByIdAndUpdate(
      album,
      {
        name: albumData.name,
        bio: albumData.bio,
        profile: albumData.profile
      }
    ).exec().then(() => {
      resolve({message: "El artista ha sido actualizado"})
    }).catch(err => reject(err))
  })
}

const deleteAlbumAction = (album) => {
  return new Promise((resolve, reject) => {
    AlbumModel.findByIdAndDelete(album).exec().then(() => {
      resolve({message: "El album ha sido elminado"})
    }).catch(err => reject(err))
  })
}

const addSongToAlbumAction = (songData, albumData) => {
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

module.exports = {
  createAlbumAction,
  updateAlbumAction,
  deleteAlbumAction,
  addSongToAlbumAction
}