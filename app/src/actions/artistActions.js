const { ArtistModel } = require('../../src/dataBase/models')

const createArtistAction = (artistData) => {
  return new Promise((resolve, reject) => {
    ArtistModel.create(artistData).then((artist) => {
      resolve({ artist, 
                message: "El artista ha sido creado satisfactoriamente :)" })
    }).catch(err => reject(err))
  })
}

module.exports = { createArtistAction }