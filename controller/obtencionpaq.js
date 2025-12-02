// Importamos el Modelo
const obtencionModel = require('../models/obtencionpaq.js');

// 1. Registrar que un Centro ha obtenido un Paquete SCORM
exports.registrarObtencion = async(req, res) => {
    const { id_centro, id_paq, fecha_obtencion } = req.body;

    if (!id_centro || !id_paq) {
        return res.status(400).send({ message: 'Los campos id_centro e id_paq son obligatorios para registrar la obtención.' });
    }

    try {
        const nuevaObtencion = await obtencionModel.registrar(id_centro, id_paq, fecha_obtencion);

        res.status(201).json({
            message: 'Obtención de paquete registrada exitosamente.',
            ...nuevaObtencion
        });

    } catch (err) {
        console.error('Error en controller al registrar la obtención:', err);

        // Manejo de errores específicos (duplicados, claves foráneas)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).send({
                message: 'Error de clave foránea: Asegúrese de que id_centro e id_paq existan.'
            });
        }
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({
                message: 'Error: Este centro ya tiene registrado este paquete SCORM.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al registrar la obtención.' });
    }
};

// 2. Obtener todos los paquetes SCORM obtenidos por un Centro
exports.obtenerPaquetesPorCentro = async(req, res) => {
    const id_centro = req.params.id_centro;

    try {
        const paquetes = await obtencionModel.obtenerPaquetesPorCentro(id_centro);
        res.status(200).json(paquetes);
    } catch (err) {
        console.error('Error en controller al obtener paquetes por centro:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

// 3. Obtener todos los Centros que han obtenido un paquete SCORM
exports.obtenerCentrosPorPaquete = async(req, res) => {
    const id_paq = req.params.id_paq;

    try {
        const centros = await obtencionModel.obtenerCentrosPorPaquete(id_paq);
        res.status(200).json(centros);
    } catch (err) {
        console.error('Error en controller al obtener centros por paquete SCORM:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

// 4. Eliminar un registro de obtención específica
exports.eliminarObtencion = async(req, res) => {
    // Los IDs se pasan en req.query para DELETE
    const { id_centro, id_paq } = req.query;

    if (!id_centro || !id_paq) {
        return res.status(400).send({ message: 'Se requieren id_centro e id_paq para eliminar el registro de obtención.' });
    }

    try {
        const eliminado = await obtencionModel.eliminar(id_centro, id_paq);

        if (!eliminado) {
            return res.status(404).send({ message: `Registro de obtención entre Centro ID ${id_centro} y Paquete ID ${id_paq} no encontrado.` });
        }

        res.status(204).send(); // 204 No Content para eliminación exitosa

    } catch (err) {
        console.error('Error en controller al eliminar el registro de obtención:', err);
        res.status(500).send({ message: 'Error interno del servidor al eliminar el registro de obtención.' });
    }
};