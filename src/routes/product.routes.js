//Ruta de autenticacion
const {Router} = require('express');
//Validation
const { check } = require('express-validator');
//Mdl personalizado para validar los check
const { validarCampos } = require('../middlewares/validate-campos.js')
const { validarJWT } = require('../middlewares/validar-jwt.js');
const { existCategoriaPorId, existProductPorId } = require('../helpers/db-validators.js');
const { esAdminRole } = require('../middlewares/validar-roles.js');

//Controladores
const { getProducts, getProductId, saveProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');

const router = Router();

//-> hhtp://url/api/category/

router.get('/',getProducts);

router.get('/:id',[
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existProductPorId),
    validarCampos
],getProductId);

router.post('/',[
        validarJWT,
        check('name','El nombre del producto es obligatorio').not().isEmpty(),
        check('category','No es un id valido de MongoDB').isMongoId(),
        check('category').custom(existCategoriaPorId),
        validarCampos
    ],saveProduct);

router.put('/:id', [
    validarJWT,
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existProductPorId),
    validarCampos
] ,updateProduct)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido de MongoDB').isMongoId(),
    check('id').custom(existProductPorId),
    check('category').custom(existCategoriaPorId),
    validarCampos
] ,deleteProduct)

module.exports = router;