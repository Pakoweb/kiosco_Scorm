// Importar la conexión a la base de datos
const pool = require('../db/pool');

// ----------------------------------------------------
// MÉTODOS CRUD PARA ASIGNACION
// ----------------------------------------------------

/**
 * Crea una nueva asignación entre un alumno y un paquete SCORM.
 * @param {object} asignacionData - Datos de la asignación (id_alumno, id_paq, fecha_asignacion, estado).
 * @returns {object} La asignación creada.
 */
async function createAsignacion(asignacionData) {
    const { id_alumno, id_paq, fecha_asignacion, estado } = asignacionData;

    // Valores predeterminados si no se proporcionan
    const defaultFecha = fecha_asignacion || new Date();
    const defaultEstado = estado || 'Asignado';

    const query = `
        INSERT INTO ASIGNACION (id_alumno, id_paq, fecha_asignacion, estado) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [id_alumno, id_paq, defaultFecha, defaultEstado];

    try {
        await pool.execute(query, values);

        return {
            message: 'Asignación creada exitosamente.',
            id_alumno,
            id_paq,
            fecha_asignacion: defaultFecha,
            estado: defaultEstado
        };

    } catch (err) {
        // Manejar errores de clave foránea (alumno o paquete no existen)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            const error = new Error('Error de clave foránea: Asegúrese de que el alumno y el paquete SCORM existan.');
            error.status = 409;
            throw error;
        }
        // Manejar duplicados (la asignación ya existe, ya que es clave compuesta)
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('Error: Este paquete SCORM ya está asignado a este alumno.');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

/**
 * Obtiene todos los paquetes SCORM asignados a un alumno específico.
 * @param {number} id_alumno - ID del alumno.
 * @returns {Array<object>} Lista de asignaciones.
 */
async function getAsignacionesByAlumno(id_alumno) {
    const query = `
        SELECT 
            a.id_paq, 
            p.nombre AS nombre_paquete,
            p.version,
            c.nombre AS nombre_centro,
            cat.nombre AS nombre_categoria,
            a.fecha_asignacion, 
            a.estado
        FROM 
            ASIGNACION a
        JOIN 
            PAQ_SCORM p ON a.id_paq = p.id_paq
        JOIN 
            CENTRO c ON p.id_centro = c.id_centro
        JOIN 
            CATEGORIA cat ON p.id_categoria = cat.id_categoria
        WHERE 
            a.id_alumno = ?
        ORDER BY 
            a.fecha_asignacion DESC`;

    const [rows] = await pool.execute(query, [id_alumno]);
    return rows;
}

/**
 * Obtiene todos los alumnos asignados a un paquete SCORM específico.
 * @param {number} id_paq - ID del paquete SCORM.
 * @returns {Array<object>} Lista de alumnos asignados.
 */
async function getAlumnosByPaquete(id_paq) {
    const query = `
        SELECT 
            a.id_alumno, 
            al.nombre AS nombre_alumno,
            al.email,
            c.nombre AS nombre_centro,
            a.fecha_asignacion, 
            a.estado
        FROM 
            ASIGNACION a
        JOIN 
            ALUMNO al ON a.id_alumno = al.id_alumno
        JOIN 
            CENTRO c ON al.id_centro = c.id_centro
        WHERE 
            a.id_paq = ?
        ORDER BY 
            al.nombre ASC`;

    const [rows] = await pool.execute(query, [id_paq]);
    return rows;
}

/**
 * Elimina una asignación utilizando la clave compuesta.
 * @param {number} id_alumno - ID del alumno.
 * @param {number} id_paq - ID del paquete SCORM.
 */
async function deleteAsignacion(id_alumno, id_paq) {
    const query = 'DELETE FROM ASIGNACION WHERE id_alumno = ? AND id_paq = ?';
    const [result] = await pool.execute(query, [id_alumno, id_paq]);

    if (result.affectedRows === 0) {
        const error = new Error(`Asignación entre Alumno ID ${id_alumno} y Paquete ID ${id_paq} no encontrada.`);
        error.status = 404;
        throw error;
    }
    // No devuelve nada si la eliminación es exitosa (código 204)
}

// Exportar todas las funciones
module.exports = {
    createAsignacion,
    getAsignacionesByAlumno,
    getAlumnosByPaquete,
    deleteAsignacion
};