//Este fichero tendra toda la logica para subir archivos.
//Cuando queramos subir archivos se llamara a este helper y listo
//Con validaciones y argumentos personalizados

const path = require('path');
const { v4: uuidv4 } = require('uuid');

/* La funcion no recibira la req, ni la res, por lo que enviaremos como argumentos: 
    files: Archivos que se deseara guardar
    validExtension: Esto sera en los casos que no solo queramos guardar imagenes, podremos pasar las extensiones (por defecto quedaron algunas)
    folder: Sera la carpeta en la cual nosotros queremos que dentro de uploads de guarde el archivo
*/
const uploadFile = ( files, validExtension = ['jpg', 'png', 'gif', 'jpeg'], folder = '') => {
    //Es bueno usar promesas cuando tengamos ciertos segmentos del codigo en lo que algo puede salir bien o algo puede salir mal
    return new Promise((resolve, reject) => {
        const { file } = files;
        const splitName = file.name.split('.');
        console.log(splitName);  
      
        //Sacamos la extencion sabiendo que siempre viene en la parte final del arreglo
        const extension = splitName[splitName.length - 1];
      
        //Validamos que el archivo tenga extenciones validas
        if (!validExtension.includes(extension)) {
            //Como no viene la res: en caso de que de un error ejecutamos el reject de la promesa
            return reject(`Extension '${extension}' no valida`)
        }
      
        /* Puede dar el caso que nuestros usuarios nombren sus imagenes iguales, por lo que para que se guarden, les pondremos un nombre UUID */
        const nameTemp = uuidv4() + `.${extension}`;  
        //Generamos el path junto al nombre que deseamos que se guarde
        let uploadPath = path.join(__dirname , '../uploads/', folder , nameTemp);
      
        //Funcion
        file.mv(uploadPath, function(err) {
          if (err) {
            return reject(err)
          }
          
          //Si todo sale bien, entonces hacemos el resolve y mandamos el nombre del archivo
          resolve(nameTemp);
        });
    })
}

module.exports = {
    uploadFile
}