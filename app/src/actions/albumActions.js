const { AlbumModel } = require('../../src/dataBase/models')

const createAlbumAction = (albumData) => {
  return new Promise((resolve, reject) => {
    AlbumModel.create(albumData).then((album) => {
      resolve({album, message: "El album ha sido creado satisfactoriamente :)"})
    }).catch(err => reject(err))
  })
}

module.exports = { createAlbumAction }