const role = require("../models/role");

//MDLW para que solo aquellos que tengan cierto rol puedan ejecutar un endpoits
const esAdminRole = async (req, res, next) =>{
    //Cualquier perticion o otro midlleware que venga despues de ""validarJWT"" podra acceder al usuario mediante el req
    
    //Verificamos que primero se haya verificado el JWT
    if (!req.user) {
        return res.status(500).json({
            message: 'Se quiere eliminar sin antes validar el token'
        })
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `${name} no tiene permisos de Administrador para eliminar`
        })
    }

    next();
}

const tieneRol = ( ...roles ) => { //...roles => Toma todos los roles y lo convierte en un array
    return (req, res, next) => { //Ya que se necesita un MDL se retorna una funcion con los parametros de mdl
        
        //Verificamos que primero se haya verificado el JWT
        if (!req.user) {
            return res.status(500).json({
            message: 'Se quiere eliminar sin antes validar el token'
            })
        };
        //Caso en que le rol del usario autenticado no este en los roles que se permien
        if (!roles.includes( req.user.role )) {
            return res.status(401).json({
                message: `El servicio requiere uno de estos roles: ${roles} `
            })
        }
        //En caso de que todo salga bien ejecutamos el next
        next();
    }
};

module.exports = {
    esAdminRole,
    tieneRol
}