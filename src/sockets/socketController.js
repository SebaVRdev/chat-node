const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generarJWT");


const socketController = async (socket = new Socket()) => {  // new Socket() -> Para tener los tipados, luego en produccion se saca
    const token = socket.handshake.headers['x-token'];

    //RECIBIMOS token a penas el usuario se conecte
    const user = await comprobarJWT(token);

    if (!user) {
        /* En caso de que no exista user desconectamos el socket */
        return socket.disconnect();
    }

    console.log('Se conecto el usuario:',user.name);

}

module.exports = {socketController};