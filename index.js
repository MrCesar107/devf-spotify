require('dotenv').config()

const {ApolloServer, gql} = require('apollo-server')
const mongoose = require('mongoose');

const { UserModel } = require('./app/src/dataBase/models')

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
  // Parent
  // args -- argumentos que recibe la funcion
  // context -- se comparte atravez de todos los resolvers
  // info
  Mutation: {
    signup: (parent, args, context, info) => {
      return UserModel.create({ ...args.data }).then(() => {
        return { message: `Se ha registrado el usuario ${args.data.name}` }
      }).catch(err => {
        return { message: `No se registro al usuario ${args.data.name}` }
      })
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