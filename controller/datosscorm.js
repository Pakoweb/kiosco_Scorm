// Importamos el Modelo
const datosScormModel = require('../models/datosScormModel');

// 1. Registrar o actualizar datos SCORM (UPSERT)
exports.registrarOActualizar = async(req, res) => {
    const {
        id_alumno,
        id_paq,
        lesson_status,
        score_raw,
        session_time
    } = req.body;

    // Validación básica
    if (!id_alumno || !id_paq || !lesson_status) {
        return res.status(400).send({ message: 'Los campos id_alumno, id_paq y lesson_status son obligatorios.' });
    }

    try {
        const resultado = await datosScormModel.upsert({
            id_alumno,
            id_paq,
            lesson_status,
            score_raw,
            session_time
        });

        // El modelo devuelve un objeto con el estado (isUpdate) y los datos
        if (resultado.isUpdate) {
            return res.status(200).json({
                message: 'Datos SCORM actualizados exitosamente.',
                ...resultado.data
            });
        } else {
            return res.status(201).json({
                message: 'Datos SCORM registrados exitosamente.',
                ...resultado.data
            });
        }

    } catch (err) {
        console.error('Error en controller al registrar/actualizar datos SCORM:', err);

        // Manejo de error de clave foránea
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(409).send({
                message: 'Error de clave foránea: Asegúrese de que id_alumno e id_paq existan.'
            });
        }
        res.status(500).send({ message: 'Error interno del servidor al registrar los datos SCORM.' });
    }
};

// 2. Obtener todos los resultados SCORM de un alumno
exports.obtenerPorAlumno = async(req, res) => {
    const id_alumno = req.params.id_alumno;

    try {
        const resultados = await datosScormModel.obtenerPorAlumno(id_alumno);
        res.status(200).json(resultados);
    } catch (err) {
        console.error('Error en controller al obtener datos SCORM por alumno:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

// 3. Obtener el resultado de un paquete específico para un alumno
exports.obtenerPorAlumnoYPaquete = async(req, res) => {
    const { id_alumno, id_paq } = req.params;

    try {
        const resultado = await datosScormModel.obtenerPorAlumnoYPaquete(id_alumno, id_paq);

        if (!resultado) {
            return res.status(404).send({ message: 'Resultado SCORM no encontrado para el alumno y paquete especificados.' });
        }

        res.status(200).json(resultado);
    } catch (err) {
        console.error('Error en controller al obtener datos SCORM específicos:', err);
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};