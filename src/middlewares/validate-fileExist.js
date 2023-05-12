//Validamos si vienen files en la request
const existFile = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            message: 'No hay archivos que subir'
        });
      }
    //Llamamos al next si el mdl pasa
    next();

    //Pasa al siguiente mdl, y si no hay mas mdl pasa a controller
}

module.exports = {
    existFile
}