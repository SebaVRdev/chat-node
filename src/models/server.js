//Haremos toda la configuracion de express
const express          = require("express");
const { createServer } = require('http');
const cors             = require('cors');

const { dbConnection } = require("../databases/config.db.js");
const fileUpload       = require("express-fileupload");
const { socketController } = require("../sockets/socketController.js");


//Crearemos la aplicacion de express
//A penas se instancie la clase
class Server {
  constructor() {
    this.app    = express();
    this.server = createServer(this.app);
    this.io     = require('socket.io')(this.server);    // <- Servidor de socket


    //Tipos de rutas
    this.paths = {
      users     : '/api/users',
      auth      : '/api/auth',
      category  : '/api/category',
      product   : '/api/product',
      search    : '/api/search',
      fileUpload: '/api/upload',
    }

    //Conectar a la BD
    this.conectDB();

    //Middlewares
    this.middlewares();

    //Rutas de la aplicacion
    this.routes();

    // Sockets
    this.sockets();
  }

  sockets(){
    this.io.on('connection', socketController);
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


    //Carga de archivos
    this.app.use(fileUpload({
      useTempFiles    : true,
      tempFileDir     : '/tmp/',
      createParentPath: true      //Si no existe el directorio cuando hacemos el 'mv' que lo cree
    })); 
  }

  //Metodo donde cargaremos las rutas
  routes() {
    //Cargamos las rutas
    this.app.use(this.paths.users, require('../routes/user.routes.js'));
    this.app.use(this.paths.auth, require('../routes/auth.routes.js'));
    this.app.use(this.paths.category, require('../routes/category.routes.js'));
    this.app.use(this.paths.product, require('../routes/product.routes.js'));
    this.app.use(this.paths.search, require('../routes/search.routes.js'));
    this.app.use(this.paths.fileUpload, require('../routes/uploads.routes.js'));
  };

  //Metodo para escuchar a un puerto
  listen(puerto){
    this.server.listen(puerto, () => {
        console.log(`Servidor escuchando en el http://localhost:${puerto}`);
    })
  }
}

module.exports = Server;
