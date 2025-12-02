const express = require('express');
const router = express.Router();
// Importamos el controlador para manejar la lógica de negocio
const datosScormController = require('../controllers/datosScormController');

// 1. POST /datoscscorm: Registrar o actualizar los datos SCORM
router.post('/', datosScormController.registrarOActualizar);

// 2. GET /datoscscorm/alumno/:id_alumno: Obtener todos los resultados SCORM de un alumno
router.get('/alumno/:id_alumno', datosScormController.obtenerPorAlumno);

// 3. GET /datoscscorm/alumno/:id_alumno/paq/:id_paq: Obtener el resultado de un paquete específico para un alumno
router.get('/alumno/:id_alumno/paq/:id_paq', datosScormController.obtenerPorAlumnoYPaquete);

module.exports = router;