const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generarJWT");
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {  // new Socket() -> Para tener los tipados, luego en produccion se saca
    const token = socket.handshake.headers['x-token'];

    //RECIBIMOS token a penas el usuario se conecte
    const user = await comprobarJWT(token);

    if (!user) {
        /* En caso de que no exista user desconectamos el socket */
        return socket.disconnect();
    }
    console.log('Se conecto el usuario:',user.name);

    chatMensajes.conectarUsuario(user);  //Conectamos el usuario

    /* A penas se conecte se emite a los demas que se conecto */
    io.emit('usuarios-activos', chatMensajes.usuariosArr); /* Mandamos los usuarios */

    socket.emit('recibir-mensajes', chatMensajes.ultimos10msg); //A penas se conecte le mandamos la lista de todos los mensajes

    //Conectar a una sala especial o privada
    socket.join(user.id);

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(user.id); 
        io.emit('usuarios-activos', chatMensajes.usuariosArr); //Volvemos a mandar los usuarios conectados

    });

    /* En el momento que el servidor reciba el evento de enviar mensaje, recibe, guarda , crea y emite otro
       evento al front para que se vea el mensaje inclusive a el
    */
    socket.on('enviar-mensaje', (payload) => {
        console.log(payload)
        /* En caso de que asignemos en front un uid, significa que es un mensaje privado */
        if (payload.uid) {
            console.log('Mensaje privado hacia ', payload.uid)
            socket.to(payload.uid).emit('mensaje-privado', {de: user.name, mensaje: payload.mensaje })

        }else{
            chatMensajes.enviarMensaje(user.id, user.name, payload.mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10msg);  /* Mandamos los ultimos 10 mensajes */
        }

    })

}

module.exports = {socketController};