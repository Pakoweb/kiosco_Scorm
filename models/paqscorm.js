// Importamos la conexión (el pool)
const pool = require('../db/pool');

// Query SELECT base para obtener todos los campos y los nombres relacionados
const baseSelectQuery = `
    SELECT 
        p.id_paq, 
        p.id_centro,
        p.id_categoria,
        p.nombre, 
        p.descripcion, 
        p.version, 
        p.archivo_path,
        c.nombre AS nombre_centro,
        cat.nombre AS nombre_categoria
    FROM 
        PAQ_SCORM p
    JOIN 
        CENTRO c ON p.id_centro = c.id_centro
    JOIN 
        CATEGORIA cat ON p.id_categoria = cat.id_categoria
`;

// 1. Crear un nuevo paquete SCORM
exports.crear = async(paqueteData) => {
    const { id_centro, id_categoria, nombre, descripcion, version, archivo_path } = paqueteData;

    const query = `
        INSERT INTO PAQ_SCORM 
        (id_centro, id_categoria, nombre, descripcion, version, archivo_path) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [id_centro, id_categoria, nombre, descripcion, version, archivo_path];

    const [result] = await pool.execute(query, values);

    // Retornamos los datos recién creados (podríamos hacer un select para incluir nombres de FKs)
    return {
        id_paq: result.insertId,
        id_centro: parseInt(id_centro),
        id_categoria: parseInt(id_categoria),
        nombre,
        descripcion,
        version,
        archivo_path
    };
};

// 2. Obtener todos los paquetes SCORM
exports.obtenerTodos = async() => {
    const query = `${baseSelectQuery} ORDER BY p.nombre ASC`;

    const [rows] = await pool.execute(query);
    return rows;
};

// 3. Obtener un paquete SCORM por ID
exports.obtenerPorId = async(id_paq) => {
    const query = `${baseSelectQuery} WHERE p.id_paq = ?`;

    const [rows] = await pool.execute(query, [id_paq]);

    return rows.length > 0 ? rows[0] : null;
};

// 4. Actualizar un paquete SCORM por ID
exports.actualizar = async(id_paq, paqueteData) => {
    const { id_centro, id_categoria, nombre, descripcion, version, archivo_path } = paqueteData;

    const query = `
        UPDATE PAQ_SCORM 
        SET id_centro = ?, id_categoria = ?, nombre = ?, descripcion = ?, version = ?, archivo_path = ?
        WHERE id_paq = ?
    `;
    const values = [id_centro, id_categoria, nombre, descripcion, version, archivo_path, id_paq];

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
        return null; // No se encontró el paquete
    }

    // Devolvemos el registro actualizado, usando la función obtenerPorId
    return exports.obtenerPorId(id_paq);
};

// 5. Eliminar un paquete SCORM por ID
exports.eliminar = async(id_paq) => {
    const query = 'DELETE FROM PAQ_SCORM WHERE id_paq = ?';
    const [result] = await pool.execute(query, [id_paq]);

    return result.affectedRows > 0; // True si se eliminó una fila
};