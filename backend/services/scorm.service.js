// services/scorm.service.js
const path = require("path");
const fs = require("fs/promises");
const fssync = require("fs");
const unzipper = require("unzipper");
const { parseStringPromise } = require("xml2js");
const pool = require("../db/pool");

const SCORM_ROOT = path.join(__dirname, "..", "scorm_content");
const DEFAULT_CATEGORY_NAME = "Pruebas";

// ------------------------------------------------------

async function unzipTo(zipPath, destDir) {
  await fs.mkdir(destDir, { recursive: true });

  return new Promise((resolve, reject) => {
    fssync.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: destDir }))
      .on("close", resolve)
      .on("error", reject);
  });
}

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

function resolveLaunchHref(manifest) {
  const m = manifest?.manifest;
  if (!m) throw new Error("Manifest inválido");

  const resources = m.resources?.[0]?.resource || [];
  const orgs = m.organizations?.[0]?.organization || [];

  const findResource = (id) =>
    resources.find(r => r.$?.identifier === id)?.$?.href || null;

  for (const org of orgs) {
    const stack = [...(org.item || [])];
    while (stack.length) {
      const item = stack.shift();
      const href = findResource(item?.$?.identifierref);
      if (href) return href;
      stack.push(...(item?.item || []));
    }
  }

  for (const r of resources) {
    if (r.$?.href) return r.$.href;
  }

  throw new Error("No se pudo determinar el launch");
}

// ------------------------------------------------------

async function getOrCreateDefaultCategory() {
  const [rows] = await pool.execute(
    "SELECT id_categoria FROM CATEGORIA WHERE nombre = ?",
    [DEFAULT_CATEGORY_NAME]
  );

  if (rows.length) return rows[0].id_categoria;

  const [ins] = await pool.execute(
    "INSERT INTO CATEGORIA (nombre, descripcion) VALUES (?, ?)",
    [DEFAULT_CATEGORY_NAME, "SCORM subidos para pruebas"]
  );

  return ins.insertId;
}

async function uploadAndRegisterScorm({ zipPath, originalName, baseUrl }) {
  const id_categoria = await getOrCreateDefaultCategory();
  const nombre = originalName.replace(/\.zip$/i, "");

  // 1️⃣ Inserta PAQ_SCORM para obtener id
  const [ins] = await pool.execute(
    "INSERT INTO PAQ_SCORM (id_categoria, nombre) VALUES (?, ?)",
    [id_categoria, nombre]
  );
  const id = ins.insertId;

  // 2️⃣ Descomprime
  const destDir = path.join(SCORM_ROOT, String(id));
  await unzipTo(zipPath, destDir);

  // 3️⃣ Busca manifest
  const manifestPath = await findManifest(destDir);
  if (!manifestPath) throw new Error("imsmanifest.xml no encontrado");

  // 4️⃣ Parse XML
  const xml = await fs.readFile(manifestPath, "utf8");
  const manifestObj = await parseStringPromise(xml);

  // 5️⃣ Resuelve launch
  const href = resolveLaunchHref(manifestObj);
  const manifestDir = path.dirname(manifestPath);
  const launchAbs = path.resolve(manifestDir, href);
  const relLaunch = path.relative(destDir, launchAbs).split(path.sep).join("/");

  const launchUrl = `${baseUrl}/scorm/${id}/${relLaunch}`;

  // 6️⃣ Actualiza PAQ_SCORM
  await pool.execute(
    `UPDATE PAQ_SCORM
     SET folder = ?, manifest_path = ?, launch_path = ?, launch_url = ?
     WHERE id_paq_scorm = ?`,
    [String(id), path.relative(destDir, manifestPath), relLaunch, launchUrl, id]
  );

  await fs.unlink(zipPath).catch(() => {});

  const [rows] = await pool.execute(
    "SELECT * FROM PAQ_SCORM WHERE id_paq_scorm = ?",
    [id]
  );

  return rows[0];
}

module.exports = { uploadAndRegisterScorm };
