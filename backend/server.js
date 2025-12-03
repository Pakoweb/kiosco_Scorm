const express = require('express');
const cors = require('cors'); // <-- importar cors
const app = express();
const port = 3000;

// Importar el pool de MySQL (configuración de la DB)
const pool = require('./db/pool'); 
// Importar las rutas de Centro
const centroRoutes = require('./routes/centro');
const alumnoRoutes = require('./routes/alumno');
const categoriaRoutes = require('./routes/categoria');
const adminRoutes = require('./routes/admin');
const paqscormRoutes = require('./routes/paqscorm');
const asignacionRoutes = require('./routes/asignacion');
const obtencionpaqRoutes = require('./routes/obtencionpaq');
const datosscormRoutes = require('./routes/datosscorm');
// Middleware para que Express pueda leer JSON en las peticiones
app.use(express.json());
app.use(cors({
  origin: '*' // o 'http://localhost:4200' para Angular
}));

// Prueba la conexión (se puede mover esta lógica a un archivo aparte, pero aquí funciona)
pool.getConnection()
  .then(connection => {
    console.log('🎉 Conexión a la base de datos MySQL exitosa!');
    connection.release(); // Libera la conexión
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.stack);
  });

// ⭐ ENLAZAR RUTAS: Cualquier petición que empiece con /centros irá al centroRoutes
app.use('/centros', centroRoutes);
app.use('/alumnos', alumnoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/admins', adminRoutes);
app.use('/paqscorms', paqscormRoutes);
app.use('/asignaciones', asignacionRoutes);
app.use('/obtencionpaqs', obtencionpaqRoutes);
app.use('/datosscorms', datosscormRoutes);

// Aquí se añadirán más rutas como:
// app.use('/alumnos', alumnoRoutes);
// app.use('/admins', adminRoutes);


// Iniciar el Servidor
app.listen(port, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${port}`);
});