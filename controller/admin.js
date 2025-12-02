// Importar el Servicio, no el Pool de la DB
const adminService = require('../models/admin.js');

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

// 1. POST /admins: Crear administrador
async function createAdmin(req, res) {
    const { id_centro, nombre, email, password_hash } = req.body;

    // Validación de campos obligatorios (Controlador)
    if (!id_centro || !nombre || !email || !password_hash) {
        return res.status(400).send({ message: 'Los campos id_centro, nombre, email y password_hash son obligatorios.' });
    }

    try {
        const newAdmin = await adminService.createAdmin(req.body);
        res.status(201).json(newAdmin); // 201 Created
    } catch (err) {
        handleServiceError(res, err, 'Error al crear el administrador.');
    }
}

// 2. GET /admins: Obtener todos los administradores
async function getAllAdmins(req, res) {
    try {
        const admins = await adminService.getAllAdmins();
        res.status(200).json(admins);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener la lista de administradores.');
    }
}

// 3. GET /admins/:id: Obtener administrador por ID
async function getAdminById(req, res) {
    const id_admin = req.params.id;

    try {
        const admin = await adminService.getAdminById(id_admin);
        res.status(200).json(admin);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener el administrador por ID.');
    }
}

// 4. PUT /admins/:id: Actualizar administrador
async function updateAdmin(req, res) {
    const id_admin = req.params.id;
    const { id_centro, nombre, email, password_hash } = req.body;

    // Validación de campos obligatorios para la actualización
    if (!id_centro || !nombre || !email || !password_hash) {
        return res.status(400).send({ message: 'Todos los campos de administrador son obligatorios para la actualización (incluyendo password_hash).' });
    }

    try {
        const updatedAdmin = await adminService.updateAdmin(id_admin, req.body);
        res.status(200).json(updatedAdmin);
    } catch (err) {
        handleServiceError(res, err, 'Error al actualizar el administrador.');
    }
}

// 5. DELETE /admins/:id: Eliminar administrador
async function deleteAdmin(req, res) {
    const id_admin = req.params.id;

    try {
        await adminService.deleteAdmin(id_admin);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        handleServiceError(res, err, 'Error al eliminar el administrador.');
    }
}


module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
};