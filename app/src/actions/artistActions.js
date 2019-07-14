const { ArtistModel } = require('../../src/dataBase/models')

const createArtistAction = (artistData) => {
  return new Promise((resolve, reject) => {
    ArtistModel.create(artistData).then((artist) => {
      resolve({ artist, 
                message: "El artista ha sido creado satisfactoriamente :)" })
    }).catch(err => reject(err))
  })
}

const addAlbumToArtist = (albumData, artistData) => {
  return new Promise((resolve, reject) => {
    ArtistModel.findByIdAndUpdate(
      artistData._id,
      { $push: { albums: albumData.album._id } },
      { new: true }
    ).exec().then(() => {
      resolve({ message: 'El album se ha creado' })
    }).catch((err) => reject(err))
  })
}

module.exports = { createArtistAction, addAlbumToArtist }