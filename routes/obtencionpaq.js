const express = require('express');
const router = express.Router();
// Importamos el controlador
const obtencionController = require('../controllers/obtencionController');

// 1. POST /obtenciones: Registrar que un Centro ha obtenido un Paquete SCORM
router.post('/', obtencionController.registrarObtencion);

// 2. GET /obtenciones/centro/:id_centro: Obtener todos los paquetes obtenidos por un Centro
router.get('/centro/:id_centro', obtencionController.obtenerPaquetesPorCentro);

// 3. GET /obtenciones/paqscorm/:id_paq: Obtener todos los Centros que han obtenido un paquete SCORM
router.get('/paqscorm/:id_paq', obtencionController.obtenerCentrosPorPaquete);

// 4. DELETE /obtenciones: Eliminar un registro de obtención específica (se usan query parameters)
router.delete('/', obtencionController.eliminarObtencion);

module.exports = router;