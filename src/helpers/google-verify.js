//Fichero para hacer toda la logica para verificar el token de google
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

//const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token='') {
  
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const {name, picture, email} = ticket.getPayload(); //Aca ya tenemos toda la info
  
  //RETORNAMOS la informacion que realmente queremos
  return {
    name, 
    picture,
    email
  }
}

module.exports = {
    googleVerify
}