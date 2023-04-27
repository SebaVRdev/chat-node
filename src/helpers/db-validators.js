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

}

//Exportamos 
module.exports = {
    isValidRole,
    existEmail,
    existUsuarioPorId,
    existNamePorId
}