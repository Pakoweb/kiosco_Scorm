// Importamos la conexión (el pool)
const pool = require('../db/pool');

// Función auxiliar para obtener los datos de un centro después de una operación
const obtenerCentroPorIdBase = async(id_centro) => {
    const query = 'SELECT id_centro, nombre, direccion, telefono, email FROM CENTRO WHERE id_centro = ?';
    const [rows] = await pool.execute(query, [id_centro]);
    return rows.length > 0 ? rows[0] : null;
}

// 1. Crear un nuevo centro
exports.crear = async(centroData) => {
    const { nombre, direccion, telefono, email } = centroData;

    const query = 'INSERT INTO CENTRO (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)';
    const values = [nombre, direccion, telefono, email];

    // El modelo maneja la conexión y la query
    const [result] = await pool.execute(query, values);

    // Retornamos el objeto creado, incluyendo el ID
    return {
        id_centro: result.insertId,
        nombre,
        direccion,
        telefono,
        email
    };
};

// 2. Obtener todos los centros
exports.obtenerTodos = async() => {
    const [rows] = await pool.execute('SELECT id_centro, nombre, direccion, telefono, email FROM CENTRO ORDER BY id_centro ASC');
    return rows;
};

// 3. Obtener un centro por ID
exports.obtenerPorId = async(id_centro) => {
    const query = 'SELECT id_centro, nombre, direccion, telefono, email FROM CENTRO WHERE id_centro = ?';
    const [rows] = await pool.execute(query, [id_centro]);
    return rows.length > 0 ? rows[0] : null;
};

// 4. Actualizar un centro por ID
exports.actualizar = async(id_centro, centroData) => {
    const { nombre, direccion, telefono, email } = centroData;

    const query = `
        UPDATE CENTRO 
        SET nombre = ?, direccion = ?, telefono = ?, email = ?
        WHERE id_centro = ?
    `;
    const values = [nombre, direccion, telefono, email, id_centro];

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
        return null; // No se encontró el centro para actualizar
    }

    // Opcional: obtener y retornar el objeto actualizado completo
    return obtenerCentroPorIdBase(id_centro);
};

// 5. Eliminar un centro por ID
exports.eliminar = async(id_centro) => {
    const query = 'DELETE FROM CENTRO WHERE id_centro = ?';
    const [result] = await pool.execute(query, [id_centro]);

    // Retorna true si se eliminó una fila, false si no se encontró
    return result.affectedRows > 0;
};