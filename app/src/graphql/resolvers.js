// importamos los modelos de la base de datos
const { UserModel } = require('../dataBase/models')
const { AdminModel } = require('../dataBase/models')

// importamos las acciones(logica de negocio para los resolvers)
const { loginAction, signUpAction } = require('../actions/userActions')
const { 
  adminLoginAction,
  adminSignUpAction
} = require('../actions/adminActions')
const { createAlbumAction } = require('../actions/albumActions')

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

    createAlbum: (parent, args, context, info) => {
      return createAlbumAction({ ...args.albumData }).then(result => {
        return result
      }).catch(err => {
        return err
      })
    }
  }
}

// exportamos los resolvers
module.exports = resolvers;