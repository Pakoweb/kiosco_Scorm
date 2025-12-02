const express = require('express');
const router = express.Router();
// Importamos solo el controlador
const asignacionController = require('../controller/asignacion.js');

// 1. POST /asignaciones: Asignar un paquete SCORM a un alumno
router.post('/', asignacionController.createAsignacion);

// 2. GET /asignaciones/alumno/:id_alumno: Obtener todos los paquetes SCORM asignados a un alumno
router.get('/alumno/:id_alumno', asignacionController.getAsignacionesByAlumno);

// 3. GET /asignaciones/paqscorm/:id_paq: Obtener todos los alumnos asignados a un paquete SCORM
router.get('/paqscorm/:id_paq', asignacionController.getAlumnosByPaquete);

// 4. DELETE /asignaciones?id_alumno=X&id_paq=Y: Eliminar una asignación específica
router.delete('/', asignacionController.deleteAsignacion);

module.exports = router;