const validarJWT  = require("./validar-jwt.js");
const validarRoles = require("./validar-roles.js");
const validarCampos = require('./validate-campos.js'); //Mdl que valida los campos del check
const uploadFile = require('./validate-fileExist.js')

module.exports = {
    ...validarJWT,
    ...validarRoles,
    ...validarCampos,
    ...uploadFile
}