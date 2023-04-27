const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFiles, updateFile, getImage } = require('../controllers/uploads.controller');
const { permittedCollections } = require('../helpers');
const { validarCampos, existFile } = require('../middlewares');

const router = Router();

router.post('/', [existFile] ,uploadFiles);

//Actualizar -> Tomara la coleccion de donde queremos hacer la actualizacion y el id del elemento
router.put('/:collection/:id', [
    existFile,
    check('id','El id debe ser MongoID').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['user', 'product'])),
    validarCampos
] ,updateFile);

//Ruta para pedir una imagen 
//  /:collection/:id
router.get('/:collection/:id', [
    check('id','El id debe ser MongoID').isMongoId(),
    check('collection').custom(c => permittedCollections(c, ['user', 'product'])),
    validarCampos
], getImage)

module.exports = router