const {Router} = require('express');
const { search } = require('../controllers/search.controller');

const router = Router();

// /productos/oreo  <- Lo que intentara buscar en la colecion de productos todos aquellos que coincidan con "oreo"
router.get('/:collection/:term', search)

module.exports = router;