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
    // ELIMINADO: password_hash
    const { id_centro, nombre, email } = req.body; 

    // ELIMINADO: password_hash de la validación
    if (!id_centro || !nombre || !email) { 
        // Mensaje ajustado para reflejar solo los campos requeridos
        return res.status(400).send({ message: 'Los campos id_centro, nombre y email son obligatorios.' });
    }

    try {
        // req.body ahora solo contiene los campos que existen en la BD
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

// 4. GET /admins/email/:email: Obtener administrador por Email
async function getAdminByEmail(req, res) {
    const email = req.params.email;

    // Validación básica de campo
    if (!email) {
        return res.status(400).send({ message: 'El campo email es obligatorio.' });
    }

    try {
        const admin = await adminService.getAdminByEmail(email);
        res.status(200).json(admin);
    } catch (err) {
        handleServiceError(res, err, 'Error al obtener el administrador por Email.');
    }
}

// 5. PUT /admins/:id: Actualizar administrador
async function updateAdmin(req, res) {
    const id_admin = req.params.id;
    // ELIMINADO: password_hash
    const { id_centro, nombre, email } = req.body;

    // Validación de campos obligatorios para la actualización
    // ELIMINADO: password_hash de la validación
    if (!id_centro || !nombre || !email) {
        return res.status(400).send({ message: 'Todos los campos de administrador son obligatorios para la actualización.' });
    }

    try {
        const updatedAdmin = await adminService.updateAdmin(id_admin, req.body);
        res.status(200).json(updatedAdmin);
    } catch (err) {
        handleServiceError(res, err, 'Error al actualizar el administrador.');
    }
}

// 6. DELETE /admins/:id: Eliminar administrador
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
    getAdminByEmail, // Exportada
    updateAdmin,
    deleteAdmin
};