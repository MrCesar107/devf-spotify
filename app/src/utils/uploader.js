// importamos la dependencia de cloudinary
const cloudinary = require('cloudinary');

// Configuramos nuestras credenciales de cloudinary
function storeUpload(stream) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  })

  // Entregamos un string a cloudinary con nuestro archivo y sus propiedades y
  // una vez que termine nos regresara un link que es donde se guardo el archivo
  return new Promise((resolve, reject) => {
    const buffer = cloudinary.v2.uploader.upload_stream((err, result) => {
      if (err) reject(err)
      resolve(result)
    })
    stream.pipe(buffer)
  })
}

function musicStoreUpload(stream) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  })

  return new Promise((resolve, reject) => {
    const buffer = cloudinary.v2.uploader
      .upload_stream(
        { resource_type: "video" }, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
      stream.pipe(buffer)
  })
}

// exportamos la funcion
module.exports = { storeUpload, musicStoreUpload }
