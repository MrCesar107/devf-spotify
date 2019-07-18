const { gql } = require('apollo-server');

// typeDefs, esquema de graphql que define los datos que seran almacenados en la
// aplicacion y la logica de negocio (queries y mutations)
// Queries -- GET -- pide datos
// Mutations -- PUT, PATCH, DELETE, POST -- sirven para crear datos,
// eliminarlos y actualizarlos
// NOTA: necesita como minimo un query para funcionar.

// @AuthDirective - sirve para decir cuales queries necesitan login para
// ejecutarce

const typeDefs = gql`
  directive @AuthDirective on QUERY | FIELD_DEFINITION | FIELD
  directive @AdminAuthDirective on QUERY | FIELD_DEFINITION | FIELD

  type Auth {
    token: String
    message: String
  }

  type Message {
    message: String
  }

  type Artist {
    id: ID
    name: String
    bio: String
    profile: String
  }

  type Album {
    id: ID
    name: String
    year: String
    coverPage: String
  }

  type Song {
    id: ID
    name: String,
    source: String
    duration: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input AdminInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
    isPrivate: Boolean = true
  }

  input AlbumInput {
    name: String!
    year: String!
    coverPage: Upload
  }

  input ArtistInput {
    name: String!
    bio: String
    profile: Upload
  }

  input SongInput {
    name: String!
    artist: String!
    source: Upload!
    duration: String
  }

  type Query {
    queryWithLogin: Message @AuthDirective
    simpleQuery: Message
    getAdminArtists: [Artist] @AdminAuthDirective
    getArtists: [Artist] @AuthDirective
    getAlbums: [Album] @AuthDirective
    getAlbumsByArtist(artist: String!): [Album] @AuthDirective
    getSongsByAlbum(album: String!): [Song] @AuthDirective
    getArtistById(artist: String!): Artist @AuthDirective
    getAlbumById(album: String!): Album @AuthDirective
  }

  type Mutation {
    userSignup(data: UserInput): Auth
    userLogin(email: String!, password: String!): Auth
    adminSignup(data: AdminInput): Auth
    adminLogin(email: String!, password: String!): Auth
    createAlbum(artist: String!, albumData: AlbumInput) : Message @AdminAuthDirective
    updateAlbum(album: String!, albumData: AlbumInput) : Message @AdminAuthDirective
    deleteAlbum(album: String!) : Message @AdminAuthDirective
    createArtist(artistData: ArtistInput) : Message @AdminAuthDirective
    updateArtist(artist: String!, artistData: ArtistInput) : Message @AdminAuthDirective
    deleteArtist(artist: String!) : Message @AdminAuthDirective
    createSong(album: String!, songData: SongInput) : Message @AdminAuthDirective
    updateSong(song: String!, songData: SongInput) : Message @AdminAuthDirective
    deleteSong(song: String!) : Message @AdminAuthDirective
  }
`

// exportamos typeDefs
module.exports = typeDefs