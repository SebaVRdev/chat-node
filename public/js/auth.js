//REFERENCIAS del formulario
const miForm = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth'
            : 'http://localhost:8080/api/auth';


//SUBMIT del formulario
miForm.addEventListener('submit', evento => {
    evento.preventDefault(); //No refrescar el navegador
    //Recorremos el formulario y guardamos sus campos en un diccionario
    const data = {};

    for (let element of miForm.elements) {
        if (element.name.length > 0) {
            data[element.name] = element.value
        }
    }

    //Con los datos listos, hacemos el POST para loguearse
    fetch('http://localhost:8080/api/auth/login', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body   : JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(data => {
        const {token, userLogin} = data;
        //GRABAMOS en el localStorage
        localStorage.setItem('email', userLogin.email);
        localStorage.setItem('token', token);

        //Nos movemos a la pagina del CHAT
        window.location = 'chat.html'
      })
      .catch(console.warn);

})

function handleCredentialResponse(response) {
        
    //Google Token : ID_TOKEN
    //console.log('id_token', response.credential);

    const body = {id_token: response.credential};

    //PETICION para mandar el token de google al backend
    fetch('http://localhost:8080/api/auth/google', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body   : JSON.stringify(body)
    })
      .then(resp => resp.json())
      .then(data => {
        const {token, usuario} = data;
        //GRABAMOS en el localStorage
        localStorage.setItem('email', usuario.email);
        localStorage.setItem('token', token);

        //Nos movemos a la pagina del CHAT
        window.location = 'chat.html'
      })
      .catch(console.warn);
  }

  const button = document.getElementById('google_signout');
  button.onclick = () => {
    console.log( google.accounts.id );
    google.accounts.id.disableAutoSelect();

    //Salismo de la cuenta
    google.accounts.id.revoke(localStorage.getItem('email'), entonces => {
      //LIMPIAMOS el LS
      localStorage.clear();
      location.reload();
    });
  }