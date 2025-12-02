// Importar la conexión a la base de datos
const pool = require('../db/pool');

// ----------------------------------------------------
// MÉTODOS DE LA BASE DE DATOS
// ----------------------------------------------------

// Función auxiliar para verificar si el centro existe (opcional, pero útil)
// La restricción FK ya lo hace, pero un check explícito puede dar mejor mensaje.
async function checkCentroExists(id_centro) {
    const [rows] = await pool.execute('SELECT id_centro FROM CENTRO WHERE id_centro = ?', [id_centro]);
    if (rows.length === 0) {
        const error = new Error(`El Centro con ID ${id_centro} no existe.`);
        error.status = 409;
        throw error;
    }
}

// 1. Crear un nuevo administrador
async function createAdmin(adminData) {
    const { id_centro, nombre, email, telefono, password_hash } = adminData;

    // Nota: Aquí se debería HASHEAR la contraseña si no viene hasheada.

    const query = 'INSERT INTO ADMIN (id_centro, nombre, email, telefono, password_hash) VALUES (?, ?, ?, ?, ?)';
    const values = [id_centro, nombre, email, telefono, password_hash];

    try {
        const [result] = await pool.execute(query, values);

        // Devolvemos el objeto sin la contraseña hasheada
        const newAdmin = {
            id_admin: result.insertId,
            id_centro,
            nombre,
            email,
            telefono
        };
        return newAdmin;

    } catch (err) {
        // Manejo de errores de Clave Foránea (id_centro no existe)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            const error = new Error(`Error de clave foránea: El id_centro ${id_centro} no existe.`);
            error.status = 409;
            throw error;
        }
        // Manejo de email duplicado (asumiendo UNIQUE)
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error(`El email "${email}" ya está registrado como administrador.`);
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// 2. Obtener todos los administradores (con nombre del centro)
async function getAllAdmins() {
    const query = `
        SELECT 
            a.id_admin, 
            a.nombre, 
            a.email, 
            a.telefono, 
            a.id_centro,
            c.nombre AS nombre_centro
        FROM 
            ADMIN a
        JOIN 
            CENTRO c ON a.id_centro = c.id_centro
        ORDER BY 
            a.nombre ASC`;

    const [rows] = await pool.execute(query);
    return rows;
}

// 3. Obtener un administrador por ID
async function getAdminById(id_admin) {
    const query = `
        SELECT 
            a.id_admin, 
            a.nombre, 
            a.email, 
            a.telefono, 
            a.id_centro,
            c.nombre AS nombre_centro
        FROM 
            ADMIN a
        JOIN 
            CENTRO c ON a.id_centro = c.id_centro
        WHERE 
            a.id_admin = ?`;

    const [rows] = await pool.execute(query, [id_admin]);

    if (rows.length === 0) {
        const error = new Error(`Administrador con ID ${id_admin} no encontrado.`);
        error.status = 404;
        throw error;
    }
    return rows[0];
}

// 4. Actualizar un administrador por ID
async function updateAdmin(id_admin, adminData) {
    const { id_centro, nombre, email, telefono, password_hash } = adminData;

    // OJO: Si password_hash se actualiza, debe ser hasheado aquí.

    // Verificamos si existe el centro de nuevo para claridad, aunque la FK lo controlará.
    await checkCentroExists(id_centro);

    const query = `
        UPDATE ADMIN 
        SET id_centro = ?, nombre = ?, email = ?, telefono = ?, password_hash = ?
        WHERE id_admin = ?
    `;
    const values = [id_centro, nombre, email, telefono, password_hash, id_admin];

    try {
        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            const error = new Error(`Administrador con ID ${id_admin} no encontrado.`);
            error.status = 404;
            throw error;
        }

        // Devolvemos el registro actualizado (sin la contraseña)
        const [updatedRows] = await pool.execute('SELECT id_admin, id_centro, nombre, email, telefono FROM ADMIN WHERE id_admin = ?', [id_admin]);
        return updatedRows[0];

    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            const error = new Error(`Error de clave foránea: El id_centro ${id_centro} no existe.`);
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// 5. Eliminar un administrador por ID
async function deleteAdmin(id_admin) {
    const query = 'DELETE FROM ADMIN WHERE id_admin = ?';
    const [result] = await pool.execute(query, [id_admin]);

    if (result.affectedRows === 0) {
        const error = new Error(`Administrador con ID ${id_admin} no encontrado.`);
        error.status = 404;
        throw error;
    }
    // No devuelve nada si la eliminación es exitosa
}

// Exportar todas las funciones
module.exports = {
    createAdmin,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
};