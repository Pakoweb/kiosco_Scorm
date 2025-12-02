const express = require('express');
const router = express.Router();
// Importamos solo el controlador para delegar la lógica de la petición HTTP
const categoriaController = require('../controller/categoria.js');

// 1. POST /categorias: Crear una nueva categoría
router.post('/', categoriaController.createCategoria);

// 2. GET /categorias: Obtener todas las categorías
router.get('/', categoriaController.getAllCategorias);

// 3. GET /categorias/:id: Obtener una categoría por ID
router.get('/:id', categoriaController.getCategoriaById);

// 4. PUT /categorias/:id: Actualizar una categoría por ID
router.put('/:id', categoriaController.updateCategoria);

// 5. DELETE /categorias/:id: Eliminar una categoría por ID
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;