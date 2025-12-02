// Importamos la conexión (el pool)
const pool = require('../db/pool');

// 1. Función para registrar o actualizar los datos SCORM (UPSERT)
exports.upsert = async(data) => {
    const { id_alumno, id_paq, lesson_status, score_raw, session_time } = data;
    const fecha_registro = new Date();

    // 1. Intentar actualizar (si el registro ya existe)
    const updateQuery = `
        UPDATE DATOS_SCORM 
        SET lesson_status = ?, score_raw = ?, session_time = ?, fecha_registro = ?
        WHERE id_alumno = ? AND id_paq = ?
    `;
    const updateValues = [lesson_status, score_raw, session_time, fecha_registro, id_alumno, id_paq];
    const [updateResult] = await pool.execute(updateQuery, updateValues);

    const resultData = {
        id_alumno,
        id_paq,
        lesson_status,
        score_raw,
        session_time,
        fecha_registro
    };

    if (updateResult.affectedRows > 0) {
        // Retorna los datos actualizados y marca como actualización
        return { isUpdate: true, data: resultData };
    }

    // 2. Si no se actualizó, insertar un nuevo registro
    const insertQuery = `
        INSERT INTO DATOS_SCORM 
        (id_alumno, id_paq, lesson_status, score_raw, session_time, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [id_alumno, id_paq, lesson_status, score_raw, session_time, fecha_registro];
    await pool.execute(insertQuery, insertValues);

    // Retorna los datos insertados y marca como nuevo registro
    return { isUpdate: false, data: resultData };
};

// 2. Obtener todos los resultados SCORM de un alumno
exports.obtenerPorAlumno = async(id_alumno) => {
    const query = `
        SELECT 
            ds.id_datos_scorm,
            ds.id_paq, 
            p.nombre AS nombre_paquete,
            ds.lesson_status,
            ds.score_raw,
            ds.session_time,
            ds.fecha_registro
        FROM 
            DATOS_SCORM ds
        JOIN 
            PAQ_SCORM p ON ds.id_paq = p.id_paq
        WHERE 
            ds.id_alumno = ?
        ORDER BY 
            ds.fecha_registro DESC`;

    const [rows] = await pool.execute(query, [id_alumno]);
    return rows;
};

// 3. Obtener el resultado de un paquete específico para un alumno
exports.obtenerPorAlumnoYPaquete = async(id_alumno, id_paq) => {
    const query = `
        SELECT 
            ds.id_datos_scorm,
            ds.lesson_status,
            ds.score_raw,
            ds.session_time,
            ds.fecha_registro,
            p.nombre AS nombre_paquete
        FROM 
            DATOS_SCORM ds
        JOIN 
            PAQ_SCORM p ON ds.id_paq = p.id_paq
        WHERE 
            ds.id_alumno = ? AND ds.id_paq = ?`;

    const [rows] = await pool.execute(query, [id_alumno, id_paq]);

    // Retorna el primer resultado o null si no se encuentra
    return rows.length > 0 ? rows[0] : null;
};