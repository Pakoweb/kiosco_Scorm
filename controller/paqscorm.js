// Importamos el Modelo
const paqScormModel = require('../models/paqscorm.js');

// 1. Crear un nuevo paquete SCORM
exports.crearPaquete = async(req, res) => {
    const { id_centro, id_categoria, nombre, descripcion, version, archivo_path } = req.body;

    if (!id_centro || !id_categoria || !nombre || !archivo_path) {
        return res.status(400).send({ message: 'Los campos id_centro, id_categoria, nombre y archivo_path son obligatorios.' });
    }

    try {
        const nuevoPaquete = await paqScormModel.crear({
            id_centro,
            id_categoria,
            nombre,
            descripcion,
            version,
            archivo_path
        });

        res.status(201).json(nuevoPaquete);
    } catch (err) {
        console.error('Error en controller al crear el paquete SCORM:', err);

        // Manejo de error de clave foránea
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).send({
                message: 'Error de clave foránea: Asegúrese de que id_centro e id_categoria existan.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al crear el paquete SCORM.' });
    }
};

// 2. Obtener todos los paquetes SCORM
exports.obtenerPaquetes = async(req, res) => {
    try {
        const paquetes = await paqScormModel.obtenerTodos();
        res.status(200).json(paquetes);
    } catch (err) {
        console.error('Error en controller al obtener los paquetes SCORM:', err);
        res.status(500).send({ message: 'Error interno del servidor al obtener los paquetes SCORM.' });
    }
};

// 3. Obtener un paquete SCORM por ID
exports.obtenerPaquetePorId = async(req, res) => {
    const id_paq = req.params.id;

    try {
        const paquete = await paqScormModel.obtenerPorId(id_paq);

        if (!paquete) {
            return res.status(404).send({ message: `Paquete SCORM con ID ${id_paq} no encontrado` });
        }

        res.status(200).json(paquete);
    } catch (err) {
        console.error('Error en controller al obtener el paquete SCORM por ID:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

// 4. Actualizar un paquete SCORM por ID
exports.actualizarPaquete = async(req, res) => {
    const id_paq = req.params.id;
    const datos = req.body;

    if (!datos.id_centro || !datos.id_categoria || !datos.nombre || !datos.archivo_path) {
        return res.status(400).send({ message: 'Los campos id_centro, id_categoria, nombre y archivo_path son obligatorios para la actualización.' });
    }

    try {
        const paqueteActualizado = await paqScormModel.actualizar(id_paq, datos);

        if (!paqueteActualizado) {
            return res.status(404).send({ message: `Paquete SCORM con ID ${id_paq} no encontrado.` });
        }

        // El modelo devuelve el objeto actualizado.
        res.status(200).json(paqueteActualizado);

    } catch (err) {
        console.error('Error en controller al actualizar el paquete SCORM:', err);

        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).send({
                message: 'Error de clave foránea: Asegúrese de que id_centro e id_categoria existan.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al actualizar el paquete SCORM.' });
    }
};

// 5. Eliminar un paquete SCORM por ID
exports.eliminarPaquete = async(req, res) => {
    const id_paq = req.params.id;

    try {
        const eliminado = await paqScormModel.eliminar(id_paq);

        if (!eliminado) {
            return res.status(404).send({ message: `Paquete SCORM con ID ${id_paq} no encontrado.` });
        }

        res.status(204).send(); // 204 No Content

    } catch (err) {
        console.error('Error en controller al eliminar el paquete SCORM:', err);

        // Manejar error si hay relaciones (e.g., está asignado a alumnos/centros)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).send({
                message: 'No se puede eliminar el paquete SCORM porque está asignado a alumnos o centros.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al eliminar el paquete SCORM.' });
    }
};