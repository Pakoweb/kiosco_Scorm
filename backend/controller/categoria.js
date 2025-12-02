const categoriaService = require('../models/categoria.js');

// Función auxiliar para manejar errores uniformemente
function handleServiceError(res, err, defaultMessage) {
    // Si el error fue lanzado por el servicio con un status (404, 409), lo usamos.
    if (err.status) {
        return res.status(err.status).send({ message: err.message });
    }
    // Error interno del servidor
    console.error('Error interno del servidor:', err);
    res.status(500).send({ message: defaultMessage || 'Error interno del servidor.' });
}

// 1. POST /categorias: Crear una nueva categoría
async function createCategoria(req, res) {
    const { nombre } = req.body;

    // Validación HTTP: Campo obligatorio
    if (!nombre) {
        return res.status(400).send({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const newCategoria = await categoriaService.createCategoria(nombre);
        res.status(201).json(newCategoria); // 201 Created
    } catch (err) {
        handleServiceError(res, err, 'Error al crear la categoría.');
    }
}

// 2. GET /categorias: Obtener todas las categorías
async function getAllCategorias(req, res) {
    try {
        const categorias = await categoriaService.getAllCategorias();
        res.status(200).json(categorias);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener las categorías.');
    }
}

// 3. GET /categorias/:id: Obtener una categoría por ID
async function getCategoriaById(req, res) {
    const id_categoria = req.params.id;

    try {
        const categoria = await categoriaService.getCategoriaById(id_categoria);
        res.status(200).json(categoria);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener la categoría por ID.');
    }
}

// 4. PUT /categorias/:id: Actualizar una categoría por ID
async function updateCategoria(req, res) {
    const id_categoria = req.params.id;
    const { nombre } = req.body;

    // Validación HTTP: Campo obligatorio
    if (!nombre) {
        return res.status(400).send({ message: 'El nombre de la categoría es obligatorio para la actualización.' });
    }

    try {
        const updatedCategoria = await categoriaService.updateCategoria(id_categoria, nombre);
        res.status(200).json(updatedCategoria);
    } catch (err) {
        handleServiceError(res, err, 'Error al actualizar la categoría.');
    }
}

// 5. DELETE /categorias/:id: Eliminar una categoría por ID
async function deleteCategoria(req, res) {
    const id_categoria = req.params.id;

    try {
        await categoriaService.deleteCategoria(id_categoria);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        handleServiceError(res, err, 'Error al eliminar la categoría.');
    }
}

module.exports = {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
};