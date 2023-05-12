const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth'
            : 'http://localhost:8080/api/auth';


let usuarioLogueado = null;
let socketServer    = null;

/* Referencias HTML */
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuario  = document.querySelector('#ulUsuario');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');

//VALIDAMOS el token de localStorage
const validarJWT = async () => {
    console.log("Inicio validacion")
    const tokenLocalStorage = localStorage.getItem('token') || '';

    if (tokenLocalStorage.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const res = await fetch(url, {
        headers: {'x-token':tokenLocalStorage}
    });

    const {user, token} = await res.json();

    //ACTUALIZAMOS EL TOKEN 
    localStorage.setItem('token', token)
    //ASIGNAMOS el usuario que se logueo
    usuarioLogueado = user;


    document.title = usuarioLogueado.name;

    await conectarSocket();
}


const conectarSocket = async () => {
    socketServer = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });

    socketServer.on('connect', () => {
        console.log('Sockets online');
    });
    
    socketServer.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socketServer.on('recibir-mensajes', (payload) => {
        console.log(payload);
        dibujarMensajes(payload);
    });
    
    socketServer.on('usuarios-activos', (payload) => {
        console.log(payload)
        dibujarUsuarios(payload);
    });

    socketServer.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload);
    });
}

/* Mostramos usuarios en HTML */
const dibujarUsuarios = ( usuarios = [] ) => {
    let usersHTML = '';
    usuarios.forEach(user => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success">${user.name}</h5>
                    <span class="fs-6 text-muted">${user.uid}</span>
                </p>
            </li>
       `
    })

    ulUsuario.innerHTML = usersHTML;
} 
/* Mostramos usuarios en HTML */
const dibujarMensajes = ( mensajes = [] ) => {
    let mensajesHTML = '';
    mensajes.forEach(mensaje => {
        mensajesHTML += `
            <li>
                <p>
                    <h5 class="text-primary">${mensaje.nombre}</h5>
                    <span>${mensaje.mensaje}</span>
                </p>
            </li>
        `
    })

    ulMensajes.innerHTML = mensajesHTML;
} 

txtMensaje.addEventListener('keyup', (ev) => {

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    const payload = {
        msg: 'Emitiendo mensaje',
        mensaje,
        uid
    }

    if (ev.keyCode !== 13) {
        return ; /* Si es distinto de Enter, no hacemos nada */
    }
    if (mensaje.length === 0) {
        return ; 
    }
    socketServer.emit('enviar-mensaje', payload);
    console.log('Se emitio el mensaje');
    txtMensaje.value = ''; //Limpiamos txt 
})

btnSalir.addEventListener('click', () => {
    //LIMPIAMOS el LS
    localStorage.clear();
    location.reload();
})

const main = async () => {
    await validarJWT();
    console.log(usuarioLogueado);
}

main();