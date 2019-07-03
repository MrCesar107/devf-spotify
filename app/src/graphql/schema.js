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

  type Auth {
    token: String
    message: String
  }

  type Message {
    message: String
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

  type Query {
    queryWithLogin: Message @AuthDirective
    simpleQuery: Message
  }

  type Mutation {
    userSignup(data: UserInput): Auth
    userLogin(email: String!, password: String!): Auth
    adminSignup(data: AdminInput): Auth
    adminLogin(email: String!, password: String!): Auth
  }
`

// exportamos typeDefs
module.exports = typeDefs