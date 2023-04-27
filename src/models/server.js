//Haremos toda la configuracion de express
const express = require("express");
var cors = require('cors');
const { dbConnection } = require("../databases/config.db.js");

//Crearemos la aplicacion de express
//A penas se instancie la clase
class Server {
  constructor() {
    this.app = express();

    //Tipos de rutas
    this.pathAPIuser = '/api/users';
    this.pathAuth = '/api/auth'

    //Conectar a la BD
    this.conectDB();

    //Middlewares
    this.middlewares();

    //Rutas de la aplicacion
    this.routes();
  }

  //Conexion a la BD
  async conectDB() {
    await dbConnection();
  }

  //Middlewares 
  middlewares(){
    //Directorio publico
    this.app.use(express.static('public'));

    //CORS
    this.app.use(cors());

    //Permita trabajar con Json
    this.app.use(express.json());
  }

  //Metodo donde cargaremos las rutas
  routes() {
    //Cargamos las rutas
    this.app.use(this.pathAPIuser, require('../routes/user.routes.js'));
    this.app.use(this.pathAuth, require('../routes/auth.routes.js'));
  };

  //Metodo para escuchar a un puerto
  listen(puerto){
    this.app.listen(puerto, () => {
        console.log(`Servidor escuchando en el http://localhost:${puerto}`);
    })
  }
}

module.exports = Server;
