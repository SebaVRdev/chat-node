// Bcrypt para ver la password
const bcryptjs = require('bcryptjs');

const User = require('../models/user.js');
const {generarJWT} = require('../helpers/generarJWT.js');
const { googleVerify } = require('../helpers/google-verify.js');

// LOGIN
const login = async (req, res) => {

    try {
        const {email, password} = req.body;

        //Verificamos Mail
        const userLogin = await User.findOne({
            email,
        });

        if (!userLogin) {
            return res.status(400).json({message: 'Email no registrado'})
        }

        //Validar Password
        const validPassword = bcryptjs.compareSync(password, userLogin.password); //entrega true si son iguales
        if (!validPassword) {
            return res.status(400).json({message: 'Contraseña incorrecta!'})
        }

        //Verificar estado cuenta, ACTIVA O NO ACTIVA
        if (!userLogin.estado) {
            return res.status(400).json({message: 'Cuenta inhabilitada!'})
        }

        //GENERAR JWT
        const token = await generarJWT(userLogin.id); //Generamos el token y lo unico que guardaremos en el payload es el id
           //Cada vez que nos autenticamos generamos un token distinto 

           //Cada vez que el usuario logueado haga una peticion, se va a corroborar si nosotros firmamos ese token y si tiene la informacion que requerimos (id)

        res.json({message: 'LOGIN POST', userLogin, token})
    } catch (error) {
        console.log(error)
        res.status(400).json({message: 'Login fallido!'})
    }
}

//Google SignIn
const googleSignIn = async (req, res) => {
    const { id_token } = req.body;

    //Tenemos que abrirlo y sacar toda la informacion
    try {
        const googleUser = await googleVerify(id_token);

        //VERIFICAMOS que el correo de google exista en la BD
        let usuario = await User.findOne({email: googleUser.email});

        if (!usuario) {
            //CREAMOS el usuario en caso de que no exista
            const data = {
                name    : googleUser.name,
                email   : googleUser.email,
                image   : googleUser.picture,
                role    : 'USER_ROLE',
                password: ':P',
                google  : true
            }
            //REUTILIZAMOS variable usuario y creamos un nuevo usuario
            usuario = new User(data);

            //GUARDAMOS el usuario
            await usuario.save();
        }

        //Si existe el usuario con el email, y tiene la propiedad de Google en false, se debe negar autenticarse 
        if (!usuario.google) {
            return res.status(401).json({
                msg: 'Hable con el administrados, usuario bloqueado'
            })
        }

        //GENERAR jwt
        const token = await generarJWT(usuario.id); //Generamos el token y lo unico que guardaremos en el payload es el id

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok     : false,
            message: 'Token no se pudo verificar'
        });
    };
};

module.exports = {
    login,
    googleSignIn
}