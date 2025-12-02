// Importamos la conexión (el pool)
const pool = require('../db/pool');

// 1. Registrar que un Centro ha obtenido un Paquete SCORM
exports.registrar = async(id_centro, id_paq, fecha_obtencion) => {
    const fecha = fecha_obtencion || new Date();

    const query = `
        INSERT INTO OBTENCION_PAQ (id_centro, id_paq, fecha_obtencion) 
        VALUES (?, ?, ?)
    `;
    const values = [id_centro, id_paq, fecha];

    // El modelo ejecuta la query
    await pool.execute(query, values);

    return {
        id_centro: parseInt(id_centro), // Convertir a número para consistencia
        id_paq: parseInt(id_paq),
        fecha_obtencion: fecha
    };
};

// 2. Obtener todos los paquetes SCORM obtenidos por un Centro
exports.obtenerPaquetesPorCentro = async(id_centro) => {
    const query = `
        SELECT 
            op.id_paq, 
            p.nombre AS nombre_paquete,
            p.version,
            cat.nombre AS nombre_categoria,
            op.fecha_obtencion
        FROM 
            OBTENCION_PAQ op
        JOIN 
            PAQ_SCORM p ON op.id_paq = p.id_paq
        JOIN 
            CATEGORIA cat ON p.id_categoria = cat.id_categoria
        WHERE 
            op.id_centro = ?
        ORDER BY 
            op.fecha_obtencion DESC`;

    const [rows] = await pool.execute(query, [id_centro]);
    return rows;
};

// 3. Obtener todos los Centros que han obtenido un paquete SCORM
exports.obtenerCentrosPorPaquete = async(id_paq) => {
    const query = `
        SELECT 
            op.id_centro, 
            c.nombre AS nombre_centro,
            c.email,
            op.fecha_obtencion
        FROM 
            OBTENCION_PAQ op
        JOIN 
            CENTRO c ON op.id_centro = c.id_centro
        WHERE 
            op.id_paq = ?
        ORDER BY 
            c.nombre ASC`;

    const [rows] = await pool.execute(query, [id_paq]);
    return rows;
};


// 4. Eliminar un registro de obtención específica
exports.eliminar = async(id_centro, id_paq) => {
    const query = 'DELETE FROM OBTENCION_PAQ WHERE id_centro = ? AND id_paq = ?';
    const [result] = await pool.execute(query, [id_centro, id_paq]);

    // Retorna true si se eliminó una fila, false si no se encontró
    return result.affectedRows > 0;
};