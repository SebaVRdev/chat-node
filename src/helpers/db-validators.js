//Validaciones especificas que van con los datos de la base de datos
const Role = require("../models/role.js");
const User = require("../models/user.js");

const isValidRole = async (rol='') => {
    const existRole = await Role.findOne({rol});
    //Si no existe el rol, mandamos el error
    if (!existRole) {
      throw new Error(`El rol ${rol} no existe en la BD`);
    }
}

const existEmail = async (email= '') => {
    console.log(email)
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error(`El email ${email} ya esta registrado en la BD`);
    }
}

const existUsuarioPorId = async (id) => {
    const existUser = await User.findById(id);
    if (!existUser) {
        throw new Error(`El user con ID:${id} no existe!`);
    }
}


const existNamePorId = async (id,datos) => {
    const name = {datos}.datos.req.body.name;
    const user = await User.findById(id);
    if(user.name === name){
        throw new Error(`El nombre ingresado es el mismo que tenia!`);
    }

};

/* 
    Cuando actualicemos una imagen, en el endpoint marcamos la coleccion en la que haremos modificaciones
    por lo que haremos un helper para usarlos en el check().custom() y verificar si la collecion existe o esta permitida para ser modificada  
    -collection: Coleccion que haremos la modificacion
    -collections: Arreglo que contiene todos las posibles colecciones modificables ej. ['user','product','category','role']
*/
const permittedCollections = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error(`La coleccion ${collection} no es permitida | Colecciones permitidas: ${collections}`)
    }

    //En caso de que todo salga bien mandamos un true
    return true
} 

//Exportamos 
module.exports = {
    isValidRole,
    existEmail,
    existUsuarioPorId,
    existNamePorId,
    permittedCollections
}