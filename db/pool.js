const mysql = require('mysql2/promise'); // Importamos mysql2/promise

// ⚠️ Configuración del Pool de Conexiones de MySQL
const pool = mysql.createPool({
  user: 'root',
  host: 'localhost',
  database: 'SCORM_PI', // Usa el nombre de tu DB
  password: '', // Contraseña vacía por defecto en XAMPP
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // Exportamos el pool para usarlo en las rutas