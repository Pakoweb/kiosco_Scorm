// Importar la conexión a la base de datos
const pool = require('../db/pool');

// ----------------------------------------------------
// MÉTODOS CRUD PARA ALUMNO
// ----------------------------------------------------

// 1. Crear un nuevo alumno
async function createAlumno(alumnoData) {
    const { id_centro, nombre, email, telefono } = alumnoData;

    // NOTA: Se ha omitido la contraseña (password_hash) ya que no estaba en el código original.
    // Para un login, esta tabla DEBE incluir un campo password_hash.

    const query = 'INSERT INTO ALUMNO (id_centro, nombre, email, telefono) VALUES (?, ?, ?, ?)';
    const values = [id_centro, nombre, email, telefono || null]; // Usar null si teléfono es opcional

    try {
        const [result] = await pool.execute(query, values);

        // Devolvemos el objeto del alumno creado
        const newAlumno = {
            id_alumno: result.insertId,
            id_centro,
            nombre,
            email,
            telefono
        };
        return newAlumno;

    } catch (err) {
        // Manejo de errores de Clave Foránea (id_centro no existe)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            const error = new Error(`Error de clave foránea: El id_centro ${id_centro} no existe.`);
            error.status = 409; // Conflicto
            throw error;
        }
        // Manejo de email duplicado (asumiendo UNIQUE)
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error(`El email "${email}" ya está registrado como alumno.`);
            error.status = 409;
            throw error;
        }
        throw err; // Lanza cualquier otro error
    }
}

// 2. Obtener todos los alumnos (con nombre del centro)
async function getAllAlumnos() {
    const query = `
        SELECT 
            a.id_alumno, 
            a.nombre, 
            a.email, 
            a.telefono, 
            a.id_centro,
            c.nombre AS nombre_centro
        FROM 
            ALUMNO a
        JOIN 
            CENTRO c ON a.id_centro = c.id_centro
        ORDER BY 
            a.nombre ASC`;

    const [rows] = await pool.execute(query);
    return rows;
}

// 3. Obtener un alumno por ID
async function getAlumnoById(id_alumno) {
    const query = `
        SELECT 
            a.id_alumno, 
            a.nombre, 
            a.email, 
            a.telefono, 
            a.id_centro,
            c.nombre AS nombre_centro
        FROM 
            ALUMNO a
        JOIN 
            CENTRO c ON a.id_centro = c.id_centro
        WHERE 
            a.id_alumno = ?`;

    const [rows] = await pool.execute(query, [id_alumno]);

    if (rows.length === 0) {
        const error = new Error(`Alumno con ID ${id_alumno} no encontrado.`);
        error.status = 404; // No encontrado
        throw error;
    }
    return rows[0];
}

// 4. Actualizar un alumno por ID
async function updateAlumno(id_alumno, alumnoData) {
    const { id_centro, nombre, email, telefono } = alumnoData;

    const query = `
        UPDATE ALUMNO 
        SET id_centro = ?, nombre = ?, email = ?, telefono = ?
        WHERE id_alumno = ?
    `;
    const values = [id_centro, nombre, email, telefono || null, id_alumno];

    try {
        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            const error = new Error(`Alumno con ID ${id_alumno} no encontrado.`);
            error.status = 404;
            throw error;
        }

        // Devolvemos el registro actualizado
        const [updatedRows] = await pool.execute('SELECT id_alumno, id_centro, nombre, email, telefono FROM ALUMNO WHERE id_alumno = ?', [id_alumno]);
        return updatedRows[0];

    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            const error = new Error(`Error de clave foránea: El id_centro ${id_centro} no existe.`);
            error.status = 409;
            throw error;
        }
        // Manejo de email duplicado
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error(`El email "${email}" ya está registrado como alumno.`);
            error.status = 409;
            throw error;
        }
        throw err;
    }
}

// 5. Eliminar un alumno por ID
async function deleteAlumno(id_alumno) {
    const query = 'DELETE FROM ALUMNO WHERE id_alumno = ?';
    const [result] = await pool.execute(query, [id_alumno]);

    if (result.affectedRows === 0) {
        const error = new Error(`Alumno con ID ${id_alumno} no encontrado.`);
        error.status = 404;
        throw error;
    }
    // No devuelve nada si la eliminación es exitosa (204)
}

// Exportar todas las funciones
module.exports = {
    createAlumno,
    getAllAlumnos,
    getAlumnoById,
    updateAlumno,
    deleteAlumno
};