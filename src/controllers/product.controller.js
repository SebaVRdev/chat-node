//Exportamos el modelo para hacer las peticiones a la BD
const Product = require('../models/product.js');

// PRODUCTOS - PAGINADO - TOTAL - POPULATE (hacer la relacion y mostrar la info completa del usuario que lo grabo)
const getProducts = async (req, res) => {
    const {limite = 7, desde = 0} = req.query;
    const query = {state: true}

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('user','name')
        .populate('category','name')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,products
    })
}

// PRODUCTO - POPULATE
const getProductId = async (req, res) => {
    const id = req.params.id
    const product = await Product.findOne({id})
    .populate('user','name')
    .populate('category','name');

    if (!product) {
        return res.status(200).json({
            message: `El producto con ID:${id} no existe!`
        })   
    }

    res.status(200).json({ messsage: "GET API", product});
}

// GUARDAR CATEGORIA
const saveProduct = async (req, res) => {  
    const {state, user, ...body} = req.body; //Le digo que el estado y el user no vengan por el body y todo lo demas lo guardo en body
    
    //Verificamos si ya existe este nombre en BD
    const productBD = await Product.findOne({name:body.name.toUpperCase()})

    if (productBD) {
        return res.status(200).json({
            message: `El nombre ${body.name} ya existe!`
        })    
    }
    //Generamos data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id //Como estamos autenticados con JWT sabemos que viene el usuario
    }
    const product = new Product(data);
    //Guardamos
    await product.save();

    res.status(201).json({ messsage: "POST API", product });
};

// ACTUALIZAR CATEGORIA - NOMBRE
const updateProduct = async (req, res) => {
    const id = req.params.id;
    //Datos 
    const {state,user, ...data} = req.body;

    //En caso de que venga el nombre, significa que lo debemos actualizar
    //Verificamos que no exista anteriormente el nombre, si no existe lo pasamos a mayuscula
    if (data.name) {
        //Verificamos que el nombre de la categoria no exista
        const productBD = await Product.findOne({name:data.name.toUpperCase()});
        if (productBD) {
            return res.status(200).json({
                message: `El producto ${name} ya existe!`
            })    
        }else{
            data.name = data.name.toUpperCase();
        }
    }
    
    //Updateamos la informacion
    const product = await Product.findByIdAndUpdate(id, data,{new:true});
    
    res.json({ messsage: `PUT API || Se va a modificar la categoria con id ${id}`, product});
};

// ELIMINADO LOGICO DE ALGUNA CATEGORIA
const deleteProduct = async (req, res) => {
    //Id del que queremos eliminar
    const id = req.params.id;

    const productDeleted = await Product.findByIdAndUpdate(id,{state: false}, {new: true})
 
    res.json({ messsage: `DELETE API || Eliminando categoria con ID: ${id}`, productDeleted});
};


module.exports = {
    getProducts,
   getProductId,
   saveProduct,
   updateProduct,
   deleteProduct
};