// Importar el Servicio, no el Pool de la DB
const alumnoService = require('../models/alumno.js');

// Función auxiliar para manejar errores uniformemente
function handleServiceError(res, err, defaultMessage) {
    // Si el error fue lanzado por el servicio con un status (404, 409), lo usamos.
    if (err.status) {
        return res.status(err.status).send({ message: err.message });
    }
    // Si es un error desconocido (DB, conexión, etc.)
    console.error('Error interno del servidor:', err);
    res.status(500).send({ message: defaultMessage || 'Error interno del servidor.' });
}

// 1. POST /alumnos: Crear alumno
async function createAlumno(req, res) {
    const { id_centro, nombre, email } = req.body;

    // Validación de campos obligatorios (Controlador)
    if (!id_centro || !nombre || !email) {
        return res.status(400).send({ message: 'Los campos id_centro, nombre y email son obligatorios.' });
    }

    try {
        const newAlumno = await alumnoService.createAlumno(req.body);
        res.status(201).json(newAlumno); // 201 Created
    } catch (err) {
        handleServiceError(res, err, 'Error al crear el alumno.');
    }
}

// 2. GET /alumnos: Obtener todos los alumnos
async function getAllAlumnos(req, res) {
    try {
        const alumnos = await alumnoService.getAllAlumnos();
        res.status(200).json(alumnos);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener la lista de alumnos.');
    }
}

// 3. GET /alumnos/:id: Obtener alumno por ID
async function getAlumnoById(req, res) {
    const id_alumno = req.params.id;

    try {
        const alumno = await alumnoService.getAlumnoById(id_alumno);
        res.status(200).json(alumno);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener el alumno por ID.');
    }
}

// 4. PUT /alumnos/:id: Actualizar alumno
async function updateAlumno(req, res) {
    const id_alumno = req.params.id;
    const { id_centro, nombre, email } = req.body;

    // Validación de campos obligatorios para la actualización
    if (!id_centro || !nombre || !email) {
        return res.status(400).send({ message: 'Los campos id_centro, nombre y email son obligatorios para la actualización.' });
    }

    try {
        const updatedAlumno = await alumnoService.updateAlumno(id_alumno, req.body);
        res.status(200).json(updatedAlumno);
    } catch (err) {
        handleServiceError(res, err, 'Error al actualizar el alumno.');
    }
}

// 5. DELETE /alumnos/:id: Eliminar alumno
async function deleteAlumno(req, res) {
    const id_alumno = req.params.id;

    try {
        await alumnoService.deleteAlumno(id_alumno);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        handleServiceError(res, err, 'Error al eliminar el alumno.');
    }
}


module.exports = {
    createAlumno,
    getAllAlumnos,
    getAlumnoById,
    updateAlumno,
    deleteAlumno
};