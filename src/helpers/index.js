const dbValidators = require('./db-validators.js') 
const generarJWT = require('./generarJWT.js') 
const googleVerify = require('./google-verify.js') 
const uploadFile = require('./uploadFile.js')


module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFile
}

/* Se pone los 3 puntos cuando es un fichero con multiples metodos dentro, esto quiere decir que va a esparcir todo su contenido
    en caso de que sea una clase o un modelo, solo traemos el modelo
*/