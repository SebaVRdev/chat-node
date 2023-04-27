const { Router } = require("express");
const { check } = require("express-validator");


//LLamamos a nuestros controladores
const {
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  getUsersOptimized,
} = require("../controllers/user.controller.js");

//Validacio personalizada
const { isValidRole, existEmail, existUsuarioPorId, existNamePorId } = require("../helpers/db-validators.js");

const {esAdminRole, tieneRol, validarJWT, validarCampos} = require('../middlewares');

//Instanciamos el router
const router = Router();

router.get("/", getUsers);
router.get("/optimized", getUsersOptimized);

router.post("/",[
  check('name', 'El nombre es obligatiorio').not().isEmpty(),
  check('password', 'El password debe ser de mas de 6 caracteres').isLength({min: 6}),
  check('email', "El correo no es valido").isEmail(),
  check('email').custom( existEmail ),
  //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), //No conviene tenerlo asi, ya que mas adelante podemos necesitar mas roles
  check('role').custom((rol) =>  isValidRole(rol)), // (isValidRole) Tambien funciona solo con eso
  validarCampos 
] ,saveUser);


router.put("/:id",[
  check('id', 'No es un ID valido de Mongo').isMongoId(),
  check('id').custom( existUsuarioPorId ),
  check('role').custom((rol) =>  isValidRole(rol)),
  check('id').custom((id,datos) =>  existNamePorId(id,datos)),
  validarCampos
] ,updateUser);

router.delete("/:id", [
  validarJWT,
  //esAdminRole, //MDL fuerza a que el usuario tenga que ser administrador
  tieneRol('ADMIN_ROLE', 'VENTAS_ROLE', 'PENE_ROLE'),
  check('id', 'No es un ID valido de Mongo').isMongoId(),
  //check('id').custom( validarJWT ),
  validarCampos
] ,deleteUser);

//Exportamos el router
module.exports = router;
