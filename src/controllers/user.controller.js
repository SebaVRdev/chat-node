//configuracion de los controladores
//Paquete para enscriptar contraseñas
const bcryptjs = require('bcryptjs');

//Exportamos el modelo para hacer las peticiones a la BD
const User = require('../models/user.js')

/* const getUsers = (req, res) => {
    //Obtener parametros que son opcionales en la url '?'
    //http://localhost:8000/api/users?q=hola&name=sebita&apikey=23131312
    const {q, name = 'No name', apikey} = req.query;
    res.json({ messsage: "GET API", q, name, apikey });
}; */

const getUsers = async (req, res) => {

    const { limit = 5 } = req.query;

    const users = await User.find().limit(limit); //.skip(desde)

    //Contar total de datos en una collection
    const total = await User.countDocuments();

    //Total Activos
    const totalActivos = await User.count({estado: true});

    res.json({ messsage: "GET API", users, total, totalActivos});
}

//Opticemos el get users, esto hacer cundo se tienen varias consultas que no son dependientes una con la otra
const getUsersOptimized = async (req, res) => {

    const { limit = 5 } = req.query;
    
    const resp = await Promise.all([
        User.find().limit(limit),
        User.countDocuments(),
        User.count({estado: true})
    ])
    
    res.json({ messsage: "GET API", resp});
}

const saveUser = async (req, res) => {    
    //Le pasamos todo el body y solo va a crear aquellos que coincidadn con el modelo    
    const user = new User(req.body);
    console.log(user);

    //Encriptar password
    const salt = bcryptjs.genSaltSync(10); //10: viene por defecto
    //Cambiamos la contraseña por la encriptada
    user.password = bcryptjs.hashSync(req.body.password, salt); 

    //Guardamos el usuario en la bd 
    await user.save()
    

    res.json({ messsage: "POST API", user });
};

const updateUser = async (req, res) => {
    //Si queremos modificar un usuario debemos obtenerlo con su id que puede venir como parametro de la url
    const id = req.params.id;
    
    //Datos 
    const {_id,email, password, ...resto} = req.body; //Sacamos los que no queremos actualizar y lo demas lo guardamos en resto
    
    //Si se pide cambiar la contraseña la debemos encriptar
    if (!password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(req.body.password, salt); 
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.json({ messsage: `PUT API || Se va a modificar el user con id ${id}`, user});
};


const deleteUser = async (req, res) => {
    //Id del que queremos eliminar
    const id = req.params.id;
 
    const userAutenticado = req.user;

    //borramos fisicamente
    //await User.findByIdAndDelete(id);

    //Borramos logiamente
    const user = await User.findByIdAndUpdate(id, {estado: false});
 
    res.json({ messsage: `DELETE API || Eliminando usuario con ID: ${id}`, user, userAutenticado });
};


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    getUsersOptimized
};