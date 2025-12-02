// Importar el Servicio, no el Pool de la DB
const asignacionService = require('../models/asignacion.js');

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

// 1. POST /asignaciones: Crear asignación
async function createAsignacion(req, res) {
    const { id_alumno, id_paq } = req.body;

    // Validación de campos obligatorios (Controlador)
    if (!id_alumno || !id_paq) {
        return res.status(400).send({ message: 'Los campos id_alumno e id_paq son obligatorios para crear una asignación.' });
    }

    try {
        const newAsignacion = await asignacionService.createAsignacion(req.body);
        res.status(201).json(newAsignacion); // 201 Created
    } catch (err) {
        handleServiceError(res, err, 'Error al crear la asignación.');
    }
}

// 2. GET /asignaciones/alumno/:id_alumno: Obtener paquetes asignados a un alumno
async function getAsignacionesByAlumno(req, res) {
    const id_alumno = req.params.id_alumno;

    try {
        const asignaciones = await asignacionService.getAsignacionesByAlumno(id_alumno);
        res.status(200).json(asignaciones);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener asignaciones por alumno.');
    }
}

// 3. GET /asignaciones/paqscorm/:id_paq: Obtener alumnos asignados a un paquete SCORM
async function getAlumnosByPaquete(req, res) {
    const id_paq = req.params.id_paq;

    try {
        const alumnos = await asignacionService.getAlumnosByPaquete(id_paq);
        res.status(200).json(alumnos);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener alumnos por paquete SCORM.');
    }
}

// 4. DELETE /asignaciones: Eliminar una asignación específica (clave compuesta)
async function deleteAsignacion(req, res) {
    // La clave compuesta viene en los query parameters
    const { id_alumno, id_paq } = req.query;

    if (!id_alumno || !id_paq) {
        return res.status(400).send({ message: 'Se requieren id_alumno e id_paq para eliminar una asignación.' });
    }

    try {
        await asignacionService.deleteAsignacion(id_alumno, id_paq);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        handleServiceError(res, err, 'Error al eliminar la asignación.');
    }
}


module.exports = {
    createAsignacion,
    getAsignacionesByAlumno,
    getAlumnosByPaquete,
    deleteAsignacion
};