//Modelo de la collect de User
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true , 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true , 'El email es obligatorio'],
        unique: true //No permite ingresar correros duplicados
    },
    password: {
        type: String,
        required: [true , 'La contraseña es obligatorio']
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true, //Cuando creamos por defecto es true
    },
    google: { //Ver si la autentication fue mediante google
        type: Boolean, 
        default: false
    }
});

//Podemos crear metodos personalizados 

//Sobrescribir toJSON
UserSchema.methods.toJSON = function() {
    //En function el this. hace referencia a la instancia creada... En flecha hace referencia al que esta por fuera
    const { __v, password, _id,...user } = this.toObject(); //Sacamos la version y la password y lo demas se almacena en user
    //Sacamos el _id para ahora ingresar uno que sea uid... para un mejor manejo
    user.uid = _id;
    return user;
}

/* En la base de datos se guarda todo, pero cuando mostramos los datos no */

module.exports = model('Usuario', UserSchema);
//Usuario => usuarios