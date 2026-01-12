// models/paqscorm.js
const pool = require('../db/pool');

// 1) Crear un nuevo paquete SCORM
exports.crear = async (paqueteData) => {
  const { id_categoria, nombre, descripcion = null, version = null } = paqueteData;

  const query = `
    INSERT INTO PAQ_SCORM (id_categoria, nombre, descripcion, version)
    VALUES (?, ?, ?, ?)
  `;
  const values = [id_categoria, nombre, descripcion, version];

  const [result] = await pool.execute(query, values);

  return {
    id_paq_scorm: result.insertId,
    id_categoria: parseInt(id_categoria),
    nombre,
    descripcion,
    version
  };
};

// 2) Obtener todos los paquetes SCORM
exports.obtenerTodos = async () => {
  const query = `
    SELECT 
      p.id_paq_scorm,
      p.id_categoria,
      p.nombre,
      p.version,
      p.descripcion,
      p.folder,
      p.manifest_path,
      p.launch_path,
      p.launch_url,
      c.nombre AS nombre_categoria
    FROM PAQ_SCORM p
    JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
    ORDER BY p.nombre ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// 3) Obtener un paquete SCORM por ID
exports.obtenerPorId = async (id_paq_scorm) => {
  const query = `
    SELECT 
      p.id_paq_scorm,
      p.id_categoria,
      p.nombre,
      p.version,
      p.descripcion,
      p.folder,
      p.manifest_path,
      p.launch_path,
      p.launch_url,
      c.nombre AS nombre_categoria
    FROM PAQ_SCORM p
    JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
    WHERE p.id_paq_scorm = ?
  `;

  const [rows] = await pool.execute(query, [id_paq_scorm]);
  return rows.length ? rows[0] : null;
};

// 4) Actualizar un paquete SCORM por ID
exports.actualizar = async (id_paq_scorm, paqueteData) => {
  const { id_categoria, nombre, descripcion = null, version = null } = paqueteData;

  const query = `
    UPDATE PAQ_SCORM
    SET id_categoria = ?, nombre = ?, descripcion = ?, version = ?
    WHERE id_paq_scorm = ?
  `;
  const values = [id_categoria, nombre, descripcion, version, id_paq_scorm];

  const [result] = await pool.execute(query, values);
  if (result.affectedRows === 0) return null;

  return exports.obtenerPorId(id_paq_scorm);
};

// 5) Eliminar un paquete SCORM por ID
exports.eliminar = async (id_paq_scorm) => {
  const query = `DELETE FROM PAQ_SCORM WHERE id_paq_scorm = ?`;
  const [result] = await pool.execute(query, [id_paq_scorm]);
  return result.affectedRows > 0;
};

// --------- NUEVO: categoría Pruebas ---------
exports.obtenerOCrearCategoriaPruebas = async () => {
  const [rows] = await pool.execute(
    "SELECT id_categoria FROM CATEGORIA WHERE nombre = ?",
    ["Pruebas"]
  );
  if (rows.length) return rows[0].id_categoria;

  const [ins] = await pool.execute(
    "INSERT INTO CATEGORIA (nombre, descripcion) VALUES (?, ?)",
    ["Pruebas", "SCORM subidos para pruebas y desarrollo"]
  );
  return ins.insertId;
};

// --------- NUEVO: update deploy (launch) ---------
exports.actualizarDeploy = async (id_paq_scorm, deploy) => {
  const { folder, manifest_path, launch_path, launch_url } = deploy;

  const query = `
    UPDATE PAQ_SCORM
    SET folder = ?, manifest_path = ?, launch_path = ?, launch_url = ?
    WHERE id_paq_scorm = ?
  `;
  const values = [folder, manifest_path, launch_path, launch_url, id_paq_scorm];

  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};
