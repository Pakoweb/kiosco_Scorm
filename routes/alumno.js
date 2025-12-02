const express = require('express');
const router = express.Router();
// Importamos el controlador para delegar la lógica de la petición HTTP
const alumnoController = require('../controller/alumno.js');

// 1. POST /alumnos: Crear un nuevo alumno
router.post('/', alumnoController.createAlumno);

// 2. GET /alumnos: Obtener todos los alumnos
router.get('/', alumnoController.getAllAlumnos);

// 3. GET /alumnos/:id: Obtener un alumno por ID
router.get('/:id', alumnoController.getAlumnoById);

// 4. PUT /alumnos/:id: Actualizar un alumno por ID
router.put('/:id', alumnoController.updateAlumno);

// 5. DELETE /alumnos/:id: Eliminar un alumno por ID
router.delete('/:id', alumnoController.deleteAlumno);

module.exports = router;