//Middleware para que se valide si tenemos un Token y se puedan ejecutar ciertos endpoits
const jwt = require('jsonwebtoken');

//Traemos modelo para obtener usuario con el uid
const User = require('../models/user');

const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            message: 'No hay token en la peticion'
        })
    }

    //Validamos que el token sea valido
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leemos usuario que corresponde al Id
        const user = await User.findOne({_id: uid});
        
        //Verificamos si encontramos usuario con ese id
        if (!user) {
            return res.status(401).json({
                message: 'No user con esa ID'
            })
        }
        
        //Ya que tenemos el user vamos a verificar si esta valido o no
        if (!user.estado) {
            return res.status(401).json({
                message: 'User con estado: false'
            })
        }
        
        //Creamos propiedad nueva para manejarla en el controlador
        req.user = user;
        
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: 'Token no valido'
        })
    }
}


module.exports = {
    validarJWT
}