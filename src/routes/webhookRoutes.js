// Importa el módulo `express` para crear un router que maneje rutas de la aplicación.
import express from 'express';

// Importa el controlador `webhookController` desde el archivo correspondiente.
// Este controlador contiene la lógica para manejar las solicitudes entrantes relacionadas con el webhook.
import webhookController from '../controllers/webhookController.js';

// Crea una nueva instancia del router de Express para definir rutas específicas.
const router = express.Router();

// Define una ruta POST en `/webhook` que llama a la función `handleIncoming` del `webhookController`.
// Esta ruta es utilizada para manejar solicitudes POST provenientes de un servicio externo.
// Por ejemplo, se usa para recibir datos o eventos enviados a un webhook.
router.post('/webhook', webhookController.handleIncoming);

// Define una ruta GET en `/webhook` que llama a la función `verifyWebhook` del `webhookController`.
// Esta ruta se utiliza para la verificación del webhook, generalmente cuando el proveedor del servicio
// solicita confirmar que el webhook es válido y puede recibir datos.
router.get('/webhook', webhookController.verifyWebhook);

// Exporta el router para que pueda ser utilizado en otros archivos.
// Este módulo permite integrar las rutas de webhook en la aplicación principal.
export default router;
