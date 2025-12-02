// Importar la conexión a la base de datos
const pool = require('../db/pool');

// ----------------------------------------------------
// MÉTODOS CRUD PARA CATEGORIA
// ----------------------------------------------------

/**
 * Crea una nueva categoría en la base de datos.
 * @param {string} nombre - Nombre de la nueva categoría.
 * @returns {object} La nueva categoría con su ID.
 */
async function createCategoria(nombre) {
    const query = 'INSERT INTO CATEGORIA (nombre) VALUES (?)';
    try {
        const [result] = await pool.execute(query, [nombre]);

        return {
            id_categoria: result.insertId,
            nombre
        };
    } catch (err) {
        // Manejar duplicados si el nombre de categoría es UNIQUE
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error(`La categoría con nombre "${nombre}" ya existe.`);
            error.status = 409; // Conflicto
            throw error;
        }
        throw err;
    }
}

/**
 * Obtiene todas las categorías ordenadas alfabéticamente.
 * @returns {Array<object>} Lista de todas las categorías.
 */
async function getAllCategorias() {
    const query = 'SELECT id_categoria, nombre FROM CATEGORIA ORDER BY nombre ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

/**
 * Obtiene una categoría específica por su ID.
 * @param {number} id_categoria - ID de la categoría a buscar.
 * @returns {object} La categoría encontrada.
 */
async function getCategoriaById(id_categoria) {
    const query = 'SELECT id_categoria, nombre FROM CATEGORIA WHERE id_categoria = ?';
    const [rows] = await pool.execute(query, [id_categoria]);

    if (rows.length === 0) {
        const error = new Error(`Categoría con ID ${id_categoria} no encontrada.`);
        error.status = 404; // No encontrado
        throw error;
    }
    return rows[0];
}

/**
 * Actualiza el nombre de una categoría específica por su ID.
 * @param {number} id_categoria - ID de la categoría a actualizar.
 * @param {string} nombre - Nuevo nombre de la categoría.
 * @returns {object} La categoría actualizada.
 */
async function updateCategoria(id_categoria, nombre) {
    const query = 'UPDATE CATEGORIA SET nombre = ? WHERE id_categoria = ?';

    try {
        const [result] = await pool.execute(query, [nombre, id_categoria]);

        if (result.affectedRows === 0) {
            const error = new Error(`Categoría con ID ${id_categoria} no encontrada.`);
            error.status = 404;
            throw error;
        }

        // Devolvemos el registro actualizado
        const [updatedRows] = await pool.execute('SELECT id_categoria, nombre FROM CATEGORIA WHERE id_categoria = ?', [id_categoria]);
        return updatedRows[0];

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error(`La categoría con nombre "${nombre}" ya existe.`);
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

/**
 * Elimina una categoría por su ID.
 * @param {number} id_categoria - ID de la categoría a eliminar.
 */
async function deleteCategoria(id_categoria) {
    const query = 'DELETE FROM CATEGORIA WHERE id_categoria = ?';

    try {
        const [result] = await pool.execute(query, [id_categoria]);

        if (result.affectedRows === 0) {
            const error = new Error(`Categoría con ID ${id_categoria} no encontrada.`);
            error.status = 404;
            throw error;
        }
    } catch (err) {
        // Manejar error de clave foránea (la categoría está en uso por otros registros)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            const error = new Error('No se puede eliminar la categoría porque está siendo utilizada por otros registros (ej. paquetes SCORM o centros).');
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// Exportar todas las funciones
module.exports = {
    createCategoria,
    getAllCategorias,
    getCategoriaById,
    updateCategoria,
    deleteCategoria
};