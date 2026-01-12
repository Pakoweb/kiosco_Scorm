// controller/paqscorm.js
const paqScormModel = require('../models/paqscorm.js');
const path = require("path");
const fs = require("fs/promises");
const fssync = require("fs");
const unzipper = require("unzipper");
const { parseStringPromise } = require("xml2js");

// 1. Crear un nuevo paquete SCORM
exports.crearPaquete = async (req, res) => {
  const { id_categoria, nombre, descripcion, version } = req.body;

  if (!id_categoria || !nombre) {
    return res.status(400).send({
      message: 'Los campos id_categoria y nombre son obligatorios.'
    });
  }

  try {
    const nuevoPaquete = await paqScormModel.crear({
      id_categoria,
      nombre,
      descripcion,
      version
    });

    res.status(201).json(nuevoPaquete);
  } catch (err) {
    console.error('Error en controller al crear el paquete SCORM:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(409).send({
        message: 'Error de clave foránea: la categoría indicada no existe.'
      });
    }

    res.status(500).send({
      message: 'Error interno del servidor al crear el paquete SCORM.'
    });
  }
};

// 2. Obtener todos los paquetes SCORM
exports.obtenerPaquetes = async (req, res) => {
  try {
    const paquetes = await paqScormModel.obtenerTodos();
    res.status(200).json(paquetes);
  } catch (err) {
    console.error('Error en controller al obtener los paquetes SCORM:', err);
    res.status(500).send({ message: 'Error interno del servidor al obtener los paquetes SCORM.' });
  }
};

// 3. Obtener un paquete SCORM por ID
exports.obtenerPaquetePorId = async (req, res) => {
  const id = req.params.id;

  try {
    const paquete = await paqScormModel.obtenerPorId(id);

    if (!paquete) {
      return res.status(404).send({ message: `Paquete SCORM con ID ${id} no encontrado` });
    }

    res.status(200).json(paquete);
  } catch (err) {
    console.error('Error en controller al obtener el paquete SCORM por ID:', err);
    res.status(500).send({ message: 'Error interno del servidor.' });
  }
};

// 4. Actualizar un paquete SCORM por ID
exports.actualizarPaquete = async (req, res) => {
  const id = req.params.id;
  const { id_categoria, nombre, descripcion, version } = req.body;

  if (!id_categoria || !nombre) {
    return res.status(400).send({ message: 'Los campos id_categoria y nombre son obligatorios para la actualización.' });
  }

  try {
    const paqueteActualizado = await paqScormModel.actualizar(id, {
      id_categoria,
      nombre,
      descripcion,
      version
    });

    if (!paqueteActualizado) {
      return res.status(404).send({ message: `Paquete SCORM con ID ${id} no encontrado.` });
    }

    res.status(200).json(paqueteActualizado);
  } catch (err) {
    console.error('Error en controller al actualizar el paquete SCORM:', err);

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(409).send({
        message: 'Error de clave foránea: Asegúrese de que id_categoria exista.'
      });
    }

    res.status(500).send({ message: 'Error interno del servidor al actualizar el paquete SCORM.' });
  }
};

// 5. Eliminar un paquete SCORM por ID
exports.eliminarPaquete = async (req, res) => {
  const id = req.params.id;

  try {
    const eliminado = await paqScormModel.eliminar(id);

    if (!eliminado) {
      return res.status(404).send({ message: `Paquete SCORM con ID ${id} no encontrado.` });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error en controller al eliminar el paquete SCORM:', err);

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).send({
        message: 'No se puede eliminar el paquete SCORM porque está asignado (relaciones activas).'
      });
    }

    res.status(500).send({ message: 'Error interno del servidor al eliminar el paquete SCORM.' });
  }
};

// 6. SUBIR ZIP SCORM (nuevo)
exports.subirZipScorm = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se envió el ZIP (field: file)" });
    }

    // Asegurar categoria "Pruebas"
    const idCategoria = await paqScormModel.obtenerOCrearCategoriaPruebas();
    const nombre = req.file.originalname.replace(/\.zip$/i, "");
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Crear PAQ_SCORM para obtener id
    const nuevo = await paqScormModel.crear({
      id_categoria: idCategoria,
      nombre,
      descripcion: null,
      version: null
    });

    const id = nuevo.id_paq_scorm;

    // Descomprimir en scorm_content/<id>/
    const scormRoot = path.join(__dirname, "..", "scorm_content");
    const destDir = path.join(scormRoot, String(id));
    await fs.mkdir(destDir, { recursive: true });

    await new Promise((resolve, reject) => {
      fssync.createReadStream(req.file.path)
        .pipe(unzipper.Extract({ path: destDir }))
        .on("close", resolve)
        .on("error", reject);
    });

    // Buscar imsmanifest.xml
    async function findManifest(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const e of entries) {
        if (e.isFile() && e.name.toLowerCase() === "imsmanifest.xml") {
          return path.join(dir, e.name);
        }
      }
      for (const e of entries) {
        if (e.isDirectory()) {
          const found = await findManifest(path.join(dir, e.name));
          if (found) return found;
        }
      }
      return null;
    }

    const manifestPath = await findManifest(destDir);
    if (!manifestPath) {
      return res.status(400).json({ message: "No se encontró imsmanifest.xml dentro del ZIP" });
    }

    function resolveLaunchHref(manifest) {
      const m = manifest?.manifest;
      if (!m) throw new Error("Manifest inválido");

      const resources = m.resources?.[0]?.resource || [];
      const orgs = m.organizations?.[0]?.organization || [];

      const byId = (identifierref) =>
        resources.find(r => r.$?.identifier === identifierref)?.$?.href || null;

      for (const org of orgs) {
        const stack = [...(org.item || [])];
        while (stack.length) {
          const it = stack.shift();
          const href = byId(it?.$?.identifierref);
          if (href) return href;
          stack.push(...(it?.item || []));
        }
      }

      for (const r of resources) {
        if (r.$?.href) return r.$.href;
      }

      throw new Error("No se pudo determinar el launch SCORM");
    }

    const xml = await fs.readFile(manifestPath, "utf8");
    const manifestObj = await parseStringPromise(xml);

    const href = resolveLaunchHref(manifestObj);
    const launchAbs = path.resolve(path.dirname(manifestPath), href);
    const relLaunch = path.relative(destDir, launchAbs).split(path.sep).join("/");

    const launchUrl = `${baseUrl}/scorm/${id}/${relLaunch}`;
    const relManifest = path.relative(destDir, manifestPath).split(path.sep).join("/");

    await paqScormModel.actualizarDeploy(id, {
      folder: String(id),
      manifest_path: relManifest,
      launch_path: relLaunch,
      launch_url: launchUrl
    });

    await fs.unlink(req.file.path).catch(() => {});

    const paquete = await paqScormModel.obtenerPorId(id);
    res.status(201).json(paquete);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Error subiendo SCORM" });
  }
};
