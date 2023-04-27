const jwt = require('jsonwebtoken');
//Funcion para generar el Token
const generarJWT = (uid) => { //UID: user id // unico
    //Generamos una promesa para el control de errores en el controlador
    return new Promise((resolve, reject) => {
        const payload = { uid };

        //Firmamos token
        //Enviamos payload
        //SecretOrPrivateKey: llave secreta que sirve para firmar token, esa clave la guardamos en .env
        //Opciones: {}
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h' //Tiempo de expiracion
        }, (err , token) => {
            //si sucede un error al firma el token
            if (err) {
                console.log(err)
                //Hacemos reject de la promesa
                reject('No se pudo generar JWT')
            }

            //Si todo sale bien hacemos el resolve
            resolve(token); //Mandamos el token
        })
    })
}


module.exports = {
    generarJWT
}