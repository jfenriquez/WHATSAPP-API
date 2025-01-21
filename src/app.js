// Importa el módulo `express` para crear y manejar una aplicación web.
import express from 'express';

// Importa la configuración personalizada desde el archivo `env.js`,
// que probablemente contiene configuraciones como el número de puerto.
import config from './config/env.js';

// Importa las rutas definidas en `webhookRoutes.js` para manejarlas dentro de la aplicación.
import webhookRoutes from './routes/webhookRoutes.js';

// Crea una instancia de la aplicación Express.
const app = express();

// Middleware para parsear las solicitudes con cuerpo en formato JSON.
// Permite manejar solicitudes con datos JSON en el cuerpo de la petición.
app.use(express.json());

// Usa las rutas de `webhookRoutes` en el nivel raíz ('/') del servidor.
// Todas las rutas definidas en `webhookRoutes.js` estarán accesibles desde aquí.
app.use('/', webhookRoutes);

// Define una ruta GET para la raíz ('/') que responde con un mensaje de texto simple.
// Esto sirve como una ruta predeterminada o de prueba para mostrar información básica.
app.get('/', (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

// Inicia el servidor escuchando en el puerto definido en `config.PORT`.
// Muestra un mensaje en la consola cuando el servidor empieza a escuchar.
app.listen(config.PORT, () => {
  console.log(`Server is listening on port:  ${config.PORT}`);
});
