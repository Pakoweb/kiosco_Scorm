const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Importamos el controlador
const paqScormController = require('../controller/paqscorm.js');

// --------- MULTER CONFIG ----------
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"))
});
const upload = multer({ storage });

// --------- ROUTES ----------

// 1. POST /paqscorms: Crear un nuevo paquete SCORM (manual, JSON)
router.post('/', paqScormController.crearPaquete);

// ✅ POST /paqscorms/upload: Subir ZIP SCORM
router.post('/upload', upload.single('file'), paqScormController.subirZipScorm);

// 2. GET /paqscorms: Obtener todos los paquetes
router.get('/', paqScormController.obtenerPaquetes);

// 3. GET /paqscorms/:id: Obtener por ID
router.get('/:id', paqScormController.obtenerPaquetePorId);

// 4. PUT /paqscorms/:id: Actualizar por ID
router.put('/:id', paqScormController.actualizarPaquete);

// 5. DELETE /paqscorms/:id: Eliminar por ID
router.delete('/:id', paqScormController.eliminarPaquete);

module.exports = router;
