// Configuracion de la base de datos
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

//Funcion que abre la conexion a la BD
const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/shop');
        console.log('Conectados a la base de datos con exito!');

    } catch (error) {
        console.log(error);
        //Si la bd no esta funcionando la idea es que se caiga por completo la BD
        throw new Error('Error al iniciar la base de datos');
    }
};

module.exports = {
    dbConnection
}