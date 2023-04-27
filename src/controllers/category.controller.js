//Exportamos el modelo para hacer las peticiones a la BD
const Category = require('../models/category.js');

// CATEGORIAS - PAGINADO - TOTAL - POPULATE (hacer la relacion y mostrar la info completa del usuario que lo grabo)
const getCategories = async (req, res) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {state: true}

    const [total, categorias] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate('user','name')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,categorias
    })
}

// CATEGORIA - POPULATE
const getCategoryId = async (req, res) => {
    const id = req.params.id
    const category = await Category.findOne({id}).populate('user','name')
    if (!category) {
        return res.status(200).json({
            message: `La categoria con ID:${id} no existe!`
        })   
    }

    res.status(200).json({ messsage: "GET API", category});
}

// GUARDAR CATEGORIA
const saveCategory = async (req, res) => {  
    const name = req.body.name.toUpperCase();   
    
    //Verificamos si ya existe este nombre en BD
    const categoryBD = await Category.findOne({name})
    
    if (categoryBD) {
        return res.status(200).json({
            message: `La categoria ${name} ya existe!`
        })    
    }
    //Generamos data a guardar
    const data = {
        name,
        user: req.user._id //Como estamos autenticados con JWT sabemos que viene el usuario
    }
    const categoria = new Category(data);
    //Guardamos
    await categoria.save()
    console.log(req.user._id)

    res.status(201).json({ messsage: "POST API", categoria });
};

// ACTUALIZAR CATEGORIA - NOMBRE
const updateCategory = async (req, res) => {
    const id = req.params.id;
    //Datos 
    const name  = req.body.name.toUpperCase(); //Sacamos los que no queremos actualizar y lo demas lo guardamos en resto

    //Verificamos que el nombre de la categoria no exista
    const categoryBD = await Category.findOne({name})
    if (categoryBD) {
        return res.status(200).json({
            message: `La categoria ${name} ya existe!`
        })    
    }

    //En caso de que no exista le modificamos solo el nombre
    const category = await Category.findByIdAndUpdate(id, {name},{new:true});
    
    res.json({ messsage: `PUT API || Se va a modificar la categoria con id ${id}`, category});
};

// ELIMINADO LOGICO DE ALGUNA CATEGORIA
const deleteCategory = async (req, res) => {
    //Id del que queremos eliminar
    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(id,{state: false}, {new: true})
 
    res.json({ messsage: `DELETE API || Eliminando categoria con ID: ${id}`});
};


module.exports = {
    getCategories,
    getCategoryId,
    saveCategory,
    updateCategory,
    deleteCategory
};