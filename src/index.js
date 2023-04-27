//Inicio del servidor 
require('dotenv').config();

//Llamamos a nuestro Servidor 
const Server = require('./models/server');

//Creamos   la instancia del servidor
const server = new Server();

const port = process.env.PORT || 2000;

server.listen(port);
