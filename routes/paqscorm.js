const express = require('express');
const router = express.Router();
// Importamos el controlador
const paqScormController = require('../controller/paqscorm.js');

// 1. POST /paqscorm: Crear un nuevo paquete SCORM
router.post('/', paqScormController.crearPaquete);

// 2. GET /paqscorm: Obtener todos los paquetes SCORM
router.get('/', paqScormController.obtenerPaquetes);

// 3. GET /paqscorm/:id: Obtener un paquete SCORM por ID
router.get('/:id', paqScormController.obtenerPaquetePorId);

// 4. PUT /paqscorm/:id: Actualizar un paquete SCORM por ID
router.put('/:id', paqScormController.actualizarPaquete);

// 5. DELETE /paqscorm/:id: Eliminar un paquete SCORM por ID
router.delete('/:id', paqScormController.eliminarPaquete);

module.exports = router;