// cargando las variables de entorno - process.env.URL_DATABASE
require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server');
const { SchemaDirectiveVisitor, AuthenticacionError } = require('apollo-server-express')
const mongoose = require("mongoose");
const { UserModel } = require('./app/src/dataBase/models');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { createToken } = require('./app/src/actions/authActions');

// parametros de conexion a la base de datos
mongoose.connect(
  process.env.URL_DATABASE,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
)
// crea la conexion a la base de datos
const mongo = mongoose.connection;
// listeners, 
mongo.on('error', console.error.bind(console, 'Error de conexion'))
mongo.on('open', () => console.log('Conectado !'))

// esquema de graphql
// type: para queries
// input: para mutations
// Mutations -- Resolver : la respuesta
const typeDefs = gql`
  directive @AuthDirective on QUERY | FIELD_DEFINITION | FIELD
  type Auth {
    token: String!
    message: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    newQuery: Auth
    messageWithLogin: String @AuthDirective
    publicMessage: String
  }

  type Mutation {
    signup(data: UserInput): Auth
    login(email: String!, password: String!): Auth
  }
`;

const resolvers = {
  Query: {
    newQuery: () => {
      return { message: 'Este es un mensaje de prueba' }
    },

    messageWithLogin: () => {
      return { message: "Este es un mensaje de un usuario autenticado" }
    },

    publicMessage: () => {
      return { message: "Este es un mensaje para todos" }
    }
  },
  // resolvers: funciones,
  // parent --- 
  // args -- argumentos que recibe la funcion
  // context -- se comparte atravez de todos los resolvers
  // info 
  Mutation: {
    signup: (parent, args, context, info) => {
      return UserModel.create({ ...args.data }).then(() => {
        return { message: `se ha registrado el usuario ${args.data.name}` }
      }).catch(err => {
        return { message: `${err}` }
      })
    },
    login: (parent, args, context, info) => {
      return loginAction({ email: args.email, password: args.password }).then(Auth => {
        console.log('auth', Auth)
        return Auth;
      }).catch(error => {
        console.log('ERROR', error)
        return {
          token: '',
          message: `${error}`
        };
      })
    }
  }
}

const loginAction = (data) => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email: data.email }).then(user => {
      console.log('errir', user.password, data.password)

      bcrypt.compare(
        data.password,
        user.password,
        (err, isValid) => {
          if (err) reject({ token: '', message: `${err}` })
          isValid
            ? resolve({ token: createToken(user),
                        message: `se ha logueado correctamente` })
            : reject({ token: '', message: `credenciales invalidas` })
        })
    })
  });
}

const getContext = (req) => {
  const token = req.headers.authorization

  if (typeof token === typeof undefined) return req
  return JWT.verify(token, process.env.SECRET, function(err, result) {
    if(err) return req;
    return UserModel.findOne({_id: result._id}).then(user => {
      console.log(user)
      return { ...req, user }
    })
  })
}

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const ctx = args[2];
      if (ctx.user) {
        return await resolve.apply(this, args);
      } else {
        throw new AuthenticationError("neceistas estar logueado para hacer esto")
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    AuthDirective: AuthDirective
  },
  context: async({req}) => getContext(req)
});

server.listen().then(({ url }) => {
  console.log(`server correindo en ${url}`)
});