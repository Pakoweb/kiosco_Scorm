// routes/admin.js (Actualizado y Limpio)

const express = require('express');
const router = express.Router();
// Solo importamos el controlador, no el Pool de la DB
const adminController = require('../controllers/adminController');

// 1. POST /admins
router.post('/', adminController.createAdmin);

// 2. GET /admins
router.get('/', adminController.getAllAdmins);

// 3. GET /admins/:id
router.get('/:id', adminController.getAdminById);

// 4. PUT /admins/:id
router.put('/:id', adminController.updateAdmin);

// 5. DELETE /admins/:id
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;