// importamos los modelos de la base de datos
const { AdminModel } = require('../dataBase/models')
const { ArtistModel } = require('../dataBase/models')
const { AlbumModel } = require('../dataBase/models')

// importamos las acciones(logica de negocio para los resolvers)
const { loginAction, signUpAction } = require('../actions/userActions')
const { 
  adminLoginAction,
  adminSignUpAction,
  addArtistToAdminAction
} = require('../actions/adminActions')
const {
  createAlbumAction,
  updateAlbumAction,
  deleteAlbumAction,
  addSongToAlbumAction
} = require('../actions/albumActions')
const {
  createArtistAction,
  updateArtistAction,
  deleteArtistAction,
  addAlbumToArtist
} = require('../actions/artistActions')
const {
  createSongAction,
  updateSongAction,
  deleteSongAction
} = require('../actions/songActions')

// importamos las utilidades
const { storeUpload, musicStoreUpload } = require('../utils/uploader')

// Resolvers funciones que son la logica del negocio y son acciones que define
// como se comportan las queries y las mutations
// parent --- es lo que necesita la funcion para que funcione como un resolver
// args -- argumentos que recibe la funcion
// context -- se variables que se comparte atravez de todos los resolvers
// info

const register = (admin) => {
  return new Promise((resolve, reject) => {
    AdminModel.findOne(admin._id).populate('artists').exec(
      function (err, adminInfo) {
        resolve(adminInfo)
      }
    )
  })
}

const registerAlbums = (artist) => {
  return new Promise((resolve, reject) => {
    ArtistModel.findById(artist).populate('albums').exec(
      function (err, artistInfo) {
        resolve(artistInfo)
      }
    )
  })
}

const registerSongs = (album) => {
  return new Promise((resolve, reject) => {
    AlbumModel.findById(album).populate('songs').exec(
      function (err, albumInfo) {
        resolve(albumInfo)
      }
    )
  })
}

const resolvers = {

  Query: {
    queryWithLogin: () => {
      return { message: 'Esto es un query con login' }
    },
    simpleQuery: () => {
      return { message: 'Esto es un simple query' }
    },

    getAdminArtists: (parent, args, context, info) => {
      const { admin } = context
      return register(admin).then(adminInfo => {
        const data = adminInfo.artists
        return data
      })
    },

    getArtists: (parent, args, context, info) => {
      return ArtistModel.find({}, (err, artists) => {
        if (err) return err
        return artists
      })
    },

    getAlbums: (parent, args, context, info) => {
      return AlbumModel.find({}, (err, albums) => {
        if (err) return err
        return albums
      })
    },

    getAlbumsByArtist: (parent, args, context, info) => {
      artist = args.artist
      return registerAlbums(artist).then(artistInfo => {
        const data = artistInfo.albums
        return data
      })
    },

    getSongsByAlbum: (parent, args, context, info) => {
      album = args.album
      return registerSongs(album).then(albumInfo => {
        const data = albumInfo.songs
        return data
      })
    },

    getArtistById: (parent, args, context, info) => {
      artist = args.artist
      return ArtistModel.findById(artist, (err, artist) => {
        if (err) return err
        return artist
      })
    },

    getAlbumById: (parent, args, context, info) => {
      album = args.album
      return AlbumModel.findById(album, (err, album) => {
        if (err) return err
        return album
      })
    }
  },

  Mutation: {
    userSignup: (parent, args, content, info) => {
      return signUpAction({ ...args.data }).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    },

    userLogin: (parent, args, content, info) => {
      const { email, password } = args;
      return loginAction(email, password).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    },

    adminSignup: (parent, args, content, info) => {
      return adminSignUpAction({ ...args.data }).then(result => {
        return result
      }).catch(err => {
        return err
      })
    },

    adminLogin: (parent, args, content, info) => {
      const { email, password } = args
      return adminLoginAction(email, password).then(result => {
        return result
      }).catch(err => {
        return err
      })
    },

    createAlbum: async (parent, args, context, info) => {
      const { createReadStream } = await args.albumData.coverPage
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const albumInfo = {
        name: args.albumData.name,
        year: args.albumData.year,
        coverPage: url
      }
      ArtistModel.findById(args.artist).then((artist) => {
        return createAlbumAction(albumInfo).then(album => {
          return addAlbumToArtist(album, artist).then((message) => {
            return message
          })
        }).catch(err => {
          return err
        })
      })
    },

    updateAlbum: async (parent, args, context, info) => {
      const album = args.album
      const { createReadStream } = await args.albumData.coverPage
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const albumInfo = {
        name: args.albumData.name,
        year: args.albumData.year,
        coverPage: url
      }
      return updateAlbumAction(album, albumInfo).then((result) => {
        return (result.message)
      }).catch(err => {
        return err
      })
    },

    deleteAlbum: (parent, args, context, indo) => {
      album = args.album
      return deleteAlbumAction(album).then((result) => {
        return result
      }).catch(err => {
        return err
      })
    },

    createArtist: async (parent, args, context, info) => {
      const { admin } = context
      const { createReadStream } = await args.artistData.profile
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const artistInfo = {
        name: args.artistData.name,
        bio: args.artistData.bio,
        profile: url
      }
      return createArtistAction(artistInfo).then(artist => {
        return addArtistToAdminAction(artist, admin).then((message) => {
          return (message)
        })
      }).catch(err => {
        return err
      })
    },

    updateArtist: async (parent, args, context, info) => {
      const artist = args.artist
      const { createReadStream } = await args.artistData.profile
      const stream = createReadStream()
      const { url } = await storeUpload(stream)
      const artistInfo = {
        name: args.artistData.name,
        bio: args.artistData.bio,
        profile: url
      }
      return updateArtistAction(artist, artistInfo).then(result => {
        return result
      }).catch(err => {
        return err
      })
    },

    deleteArtist: (parent, args, context, info) => {
      artist = args.artist
      return deleteArtistAction(artist).then((result) => {
        return result
      }).catch((err) => {
        return err
      })
    },

    createSong: async (parent, args, context, info) => {
      const { createReadStream } = await args.songData.source
      const stream = createReadStream()
      const { url } = await musicStoreUpload(stream)
      const songInfo = {
        name: args.songData.name,
        artist: args.songData.artist,
        source: url,
        duration: ""
      }
      AlbumModel.findById(args.album).then((album) => {
        return createSongAction(songInfo).then(song => {
          return addSongToAlbumAction(song, album).then((result) => {
            return result
          })
        }).catch(err => {
          return err
        })
      })
    },

    updateSong: async (parent, args, context, info) => {
      const song = args.song
      const { createReadStream } = await args.songData.source
      const stream = createReadStream()
      const { url } = await musicStoreUpload(stream)
      const songInfo = {
        name: args.songData.name,
        artist: args.songData.artist,
        source: url,
        duration: ""
      }
      return updateSongAction(song, songInfo).then((result) => {
        return result
      }).catch(err => {
        return err
      })
    },

    deleteSong: (parent, args, context, info) => {
      const song = args.song
      return deleteSongAction(song).then((result) => {
        return result
      }).catch(err => {
        return err
      })
    }
  }
}

// exportamos los resolvers
module.exports = resolvers;