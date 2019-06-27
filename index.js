require('dotenv').config()

const {ApolloServer, gql} = require('apollo-server')
const mongoose = require('mongoose');

mongoose.connect(
    process.env.URL_DATABASE,
    {
        userCreateIndex: true,
        userNewUrlParser: true,
    }
);

const mongo = mongoose.connection;
// Listeners
mongo.on('error', console.error.bind('Error de conexion'))
mongo.on('open', () => console.log('Conectado !'))

// Esquema de graphql
const typeDefs = gql`
  type Auth {
    message: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
  }

  type Query {
    newQuery: Auth
  }

  type Mutation {
    signup(data: UserInput): Auth
  }
`

// Resolvers

const resolvers = {
  Query: {
    newQuery: () => {
      return { message: "Este es un mensaje de prueba" }
    }
  },
  Mutation: {
    signup: () => {
      return { message: "Este es un mensaje de prueba" }
    }
  }
}

// Levantando el servidor
const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server running in por ${url}`)
})