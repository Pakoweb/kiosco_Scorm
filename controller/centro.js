// Importamos el Modelo para acceder a la lógica de base de datos
const centroModel = require('../models/centroModel');

// 1. Crear un nuevo centro
exports.crearCentro = async(req, res) => {
    const { nombre, direccion, telefono, email } = req.body;

    // Validación básica (debe ir aquí o en un middleware)
    if (!nombre) {
        return res.status(400).send({ message: 'El nombre del centro es obligatorio.' });
    }

    try {
        const nuevoCentro = await centroModel.crear({ nombre, direccion, telefono, email });
        res.status(201).json(nuevoCentro);
    } catch (err) {
        console.error('Error en controller al crear el centro:', err);
        res.status(500).send({ message: 'Error interno del servidor al crear el centro.' });
    }
};

// 2. Obtener todos los centros
exports.obtenerCentros = async(req, res) => {
    try {
        const centros = await centroModel.obtenerTodos();
        res.status(200).json(centros);
    } catch (err) {
        console.error('Error en controller al obtener los centros:', err);
        res.status(500).send({ message: 'Error interno del servidor al obtener los centros.' });
    }
};

// 3. Obtener un centro por ID
exports.obtenerCentroPorId = async(req, res) => {
    const id_centro = req.params.id;

    try {
        const centro = await centroModel.obtenerPorId(id_centro);

        if (!centro) {
            return res.status(404).send({ message: `Centro con ID ${id_centro} no encontrado` });
        }

        res.status(200).json(centro);
    } catch (err) {
        console.error('Error en controller al obtener el centro por ID:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

// 4. Actualizar un centro por ID
exports.actualizarCentro = async(req, res) => {
    const id_centro = req.params.id;
    const datos = req.body;

    try {
        const centroActualizado = await centroModel.actualizar(id_centro, datos);

        if (!centroActualizado) {
            return res.status(404).send({ message: `Centro con ID ${id_centro} no encontrado.` });
        }

        res.status(200).json(centroActualizado);

    } catch (err) {
        console.error('Error en controller al actualizar el centro:', err);
        res.status(500).send({ message: 'Error interno del servidor al actualizar el centro.' });
    }
};

// 5. Eliminar un centro por ID
exports.eliminarCentro = async(req, res) => {
    const id_centro = req.params.id;

    try {
        const eliminado = await centroModel.eliminar(id_centro);

        if (!eliminado) {
            return res.status(404).send({ message: `Centro con ID ${id_centro} no encontrado.` });
        }

        res.status(204).send(); // 204 No Content para eliminación exitosa

    } catch (err) {
        console.error('Error en controller al eliminar el centro:', err);
        // Manejo específico del error de clave foránea
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({
                message: 'No se puede eliminar el centro porque tiene alumnos o administradores asociados.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al eliminar el centro.' });
    }
};