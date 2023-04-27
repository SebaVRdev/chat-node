//Las validaciones pueden ir en otro fichero pero en este caso solo vamos a exportar el search,
//Por lo que haremos algunas validacion aca
const {ObjectId} = require('mongoose').Types;

const { response } = require('express');
const {User, Category, Product, Role} = require('../models/index.js')

//Validar si existe la coleccion
const permittedCollections = [
    'user',
    'category',
    'product',
    'role'
];


const search = (req , res) => {
    const { collection, term } = req.params;
    //Verificamos que la coleccion que se esta pidiendo este permitida
    if (!permittedCollections.includes(collection)) {
        return res.status(400).json({
            message: `Las colecciones permitidas son: ${permittedCollections}`
        })
    }

    const functionToExecute = collectionsSearch[collection]; //(term, res);
    console.log(functionToExecute)
    functionToExecute(term, res)
    /* switch (collection) {
        case 'user':
            searchUsers(term,res)
            break;
        case 'product':
            searchProduct(term, res)
            break;
        case 'category':
            searchCategory(term, res)
            break;
        case 'role':
            
            break;

        default:
            res.status(500).json({
                message: 'Se le olvido hacer esta busqueda'
            })
            break;
    } */
}

const searchUsers = async (term = '' , res = response, example) => {
    const isMongoID = ObjectId.isValid(term); //TRUE o FALSE
    //En caso que sea un mongoId buscamos por id
    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            result: (user) ? [user] : []
        });
    };

    //En caso de que no sea mongoId, la otra opcion sera buscar por nombre que sean coincidentes
    const regex = new RegExp(term, 'i'); //La expresion regular sera el termino, 'i' <- insencible a las mayusculas 

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],//Operador de MongoDB para buscar por una propiedad o por otra
        $and: [{estado: true}] //Operador de MongoDB para buscar aquella que si o si cumplan la condicion
    });

    res.status(200).json({
        result: users
    });     
};

const searchProduct = async (term = '' , res = response) => {
    const isMongoID = ObjectId.isValid(term); //TRUE o FALSE
    //En caso que sea un mongoId buscamos por id
    if (isMongoID) {
        const product = await Product.findById(term);
        return res.json({
            result: (product) ? [product] : []
        });
    };

    //En caso de que no sea mongoId, la otra opcion sera buscar por nombre que sean coincidentes
    const regex = new RegExp(term, 'i'); //La expresion regular sera el termino, 'i' <- insencible a las mayusculas 
    const products = await Product.find({name: regex}).populate('category', 'name');
    res.status(200).json({
        result: products
    });     
};
const searchCategory = async (term = '' , res = response) => {
    const isMongoID = ObjectId.isValid(term); //TRUE o FALSE
    //En caso que sea un mongoId buscamos por id
    if (isMongoID) {
        const category = await Category.findById(term);
        return res.json({
            result: (category) ? [category] : []
        });
    };

    //En caso de que no sea mongoId, la otra opcion sera buscar por nombre que sean coincidentes
    const regex = new RegExp(term, 'i'); //La expresion regular sera el termino, 'i' <- insencible a las mayusculas 
    const categories = await Category.find({name: regex}).populate('user', 'name');
    res.status(200).json({
        result: categories
    });     
};

const collectionsSearch = {
    'user': searchUsers,
    'category': searchCategory,
    'product': searchProduct
};


module.exports = {
    search
};