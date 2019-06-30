// importamos los modelos de la base de datos
const { UserModel } = require('../dataBase/models')

// importamos las acciones(logica de negocio para los resolvers)
const { loginAction, signUpAction } = require('../actions/userActions')

// Resolvers funciones que son la logica del negocio y son acciones que define
// como se comportan las queries y las mutations
// parent --- es lo que necesita la funcion para que funcione como un resolver
// args -- argumentos que recibe la funcion
// context -- se variables que se comparte atravez de todos los resolvers
// info

const resolvers = {
  Query: {
    queryWithLogin: () => {
      return { message: 'Esto es un query con login' }
    },
    simpleQuery: () => {
      return { message: 'Esto es un simple query' }
    }
  },

  Mutation: {
    signup: (parent, args, content, info) => {
      return signUpAction({ ...args.data }).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    },

    login: (parent, args, content, info) => {
      const { email, password } = args;
      return loginAction(email, password).then(result => {
        return result
      }).catch(err => {
        return err;
      })
    }
  }
}

// exportamos los resolvers
module.exports = resolvers;