//Ruta de autenticacion
const {Router} = require('express');
//Validation
const { check } = require('express-validator');
//Mdl personalizado para validar los check
const { validarCampos } = require('../middlewares/validate-campos.js')
const { validarJWT } = require('../middlewares/validar-jwt.js');
const { existCategoriaPorId } = require('../helpers/db-validators.js');

//Controladores
const { getCategories,getCategoryId,saveCategory,updateCategory,deleteCategory } = require('../controllers/category.controller.js');
const { esAdminRole } = require('../middlewares/validar-roles.js');

const router = Router();

//-> hhtp://url/api/category/

router.get('/',getCategories);

router.get('/:id',[
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existCategoriaPorId),
    validarCampos
],getCategoryId);

router.post('/',[
        validarJWT,
        check('name','El nombre de la categoria es obligatorio').not().isEmpty(),
        validarCampos
    ],saveCategory);

router.put('/:id', [
    validarJWT,
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existCategoriaPorId),
    check('name','El nombre debe valido!').not().isEmpty(),
    validarCampos
] ,updateCategory)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existCategoriaPorId),
    validarCampos
] ,deleteCategory)

module.exports = router;