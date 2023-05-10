const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth'
            : 'http://localhost:8080/api/auth';


let usuarioLogueado = null;

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
    const socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    });
}


const main = async () => {
    await validarJWT();
    console.log(usuarioLogueado);
}

main();