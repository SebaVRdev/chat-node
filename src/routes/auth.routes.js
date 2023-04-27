//Ruta de autenticacion
const {Router} = require('express');

//Validation
const { check } = require('express-validator');
//Mdl personalizado para validar los check
const { validarCampos } = require('../middlewares/validate-campos.js')

//Controllers
const { login, googleSignIn } = require('../controllers/auth.controller');

const router = Router();


router.post('/login', [
    check('email', 'El correro es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] ,login)

router.post('/google', [
    check('id_token', 'Id_Token de Google es necesario').not().isEmpty(), //No tiene que estar vacio
    validarCampos
] ,googleSignIn)


module.exports = router;