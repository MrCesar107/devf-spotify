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
    name: String
    bio: String
    profile: String
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
    artist: String!
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
    getArtists: [Artist]
  }

  type Mutation {
    userSignup(data: UserInput): Auth
    userLogin(email: String!, password: String!): Auth
    adminSignup(data: AdminInput): Auth
    adminLogin(email: String!, password: String!): Auth
    createAlbum(albumData: AlbumInput) : Message @AdminAuthDirective
    createArtist(artistData: ArtistInput) : Message @AdminAuthDirective
    createSong(songData: SongInput) : Message @AdminAuthDirective
  }
`

// exportamos typeDefs
module.exports = typeDefs