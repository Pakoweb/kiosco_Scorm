// routes/admin.js (Actualizado y Limpio)

const express = require('express');
const router = express.Router();
// Solo importamos el controlador, no el Pool de la DB
const adminController = require('../controller/admin.js');

// 1. POST /admins: Crear administrador
router.post('/', adminController.createAdmin);

// 2. GET /admins: Obtener todos los administradores
router.get('/', adminController.getAllAdmins);

// 3. GET /admins/email/:email: Obtener administrador por Email (NUEVA RUTA)
// Nota: Se coloca antes de /:id para asegurar que 'email' no sea interpretado como un ID numérico.
router.get('/email/:email', adminController.getAdminByEmail);

// 4. GET /admins/:id: Obtener administrador por ID
router.get('/:id', adminController.getAdminById);

// 5. PUT /admins/:id: Actualizar administrador
router.put('/:id', adminController.updateAdmin);

// 6. DELETE /admins/:id: Eliminar administrador
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;