const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    //Llamamos al next si el mdl pasa
    next();

    //Pasa al siguiente mdl, y si no hay mas mdl pasa a controller
}


module.exports = {validarCampos};