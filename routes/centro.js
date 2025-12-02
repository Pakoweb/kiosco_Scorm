const express = require('express');
const router = express.Router();
// Importamos el controlador para manejar la lógica de negocio
const centroController = require('../controllers/centroController');

// 1. POST /centros: Crear un nuevo centro
router.post('/', centroController.crearCentro);

// 2. GET /centros: Obtener todos los centros
router.get('/', centroController.obtenerCentros);

// 3. GET /centros/:id: Obtener un centro por ID
router.get('/:id', centroController.obtenerCentroPorId);

// 4. PUT /centros/:id: Actualizar un centro por ID
router.put('/:id', centroController.actualizarCentro);

// 5. DELETE /centros/:id: Eliminar un centro por ID
router.delete('/:id', centroController.eliminarCentro);

module.exports = router;