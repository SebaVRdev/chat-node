  //Fichero para manejar la subida de archivos
const path = require('path');
const fs = require('fs');

const { uploadFile } = require("../helpers");
//Models
const {User} = require('../models/index.js')


const uploadFiles = async (req, res) => {

  /* 
    Esta validacion es una que se puede repetir en todos los lugares en el que necesitemos subir archivos, por lo que vamos a 
    hacerlo en un middleware y reutilizarlo
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({
        message: 'No hay archivos que subir'
    });
    return;
  } */

  //Ejecutamos helper, al ser una promesa puede ejecutar el reject, por lo que usaremos try-catch
  try {
    //const name = await uploadFile(req.files ); //Esto mandara el archivo, usara la extenciones por defecto y guardara dentro de uploads
    const filetxt = await uploadFile(req.files , ['txt', 'md'], 'textos')
    res.json({
      filetxt
    }) 
  } catch (error) {
    res.status(400).json({error})
  }
}

//Actualizar Archivo
const updateFile = async (req, res) => {
  const {id, collection} = req.params;
  let model;

  switch (collection) {
    case 'user':
      model = await User.findById(id);
      //Validamos que exista el id, en la collecion que vamos a modificar
      if (!model) {
        return res.status(400).json({msg: `No existe user con id: ${id}`})
      }
    break;
  
    default:
      return res.status(500).json({msg: 'Aun no se implementa esto'})
  }
  //Limpiar imagenes previas

  //Preguntamos si el modelo que queremos cambiar ya tiene una imagen asociada
  if (model.image) {
    /* Si tiene una imagen vamos a recuperar el posible path de la imagen */
    const pathImage = path.join(__dirname, '../uploads', collection, model.image ); //<- Sabremos en que carpeta esta por la collection
    //Verificamos si existe el archivo
    if (fs.existsSync(pathImage)) {
      //Borramos en caso de que exista
      fs.unlinkSync(pathImage)
    }
  }

  //Una vez ya tenemos el modelo y la limpiza de su antigua imagen, subimos el archivo nuevo a la carpea uploads y guardamos en base de datos
  const nameFile = await uploadFile(req.files,undefined,collection);
  model.image= nameFile;
  await model.save()

  res.json({msg: 'Actualizando File', id, collection})
}

const getImage = async(req, res) => {
  const {id, collection} = req.params;
  let model;

  switch (collection) {
    case 'user':
      model = await User.findById(id);
      //Validamos que exista el id, en la collecion que vamos a mostrar
      if (!model) {
        return res.status(400).json({msg: `No user con id : ${id}`})
      }
    break;
  
    default:
      return res.status(500).json({msg: 'Aun no se implementa esto'})
  }
  console.log(model)

  //Preguntamos si el modelo que queremos mostrar ya tiene una imagen asociada
  if (model.image) {
    /* Si tiene una imagen vamos a recuperar el posible path de la imagen */
    const pathImage = path.join(__dirname, '../uploads', collection, model.image );
    //Verificamos si existe el archivo
    if (fs.existsSync(pathImage)) {
      //Respondemos la imagen
      return res.sendFile(pathImage)
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg' );
  //En caso de que no haya imagen asociada en el modelo
  res.sendFile(pathImage)
}

module.exports = {
    uploadFiles,
    updateFile,
    getImage
}