// Importa la configuración desde `env.js` donde están definidas las variables de entorno.
import config from "../config/env.js";

// Importa el servicio `messageHandler` que contiene la lógica para manejar los mensajes entrantes.
import messageHandler from "../services/messageHandler.js";

// Define la clase `WebhookController` para manejar las solicitudes relacionadas con los webhooks.
class WebhookController {
  // Método asíncrono para manejar solicitudes POST de webhooks entrantes.
  async handleIncoming(req, res) {
    // Extrae el primer mensaje del cuerpo de la solicitud usando encadenamiento opcional para evitar errores si las propiedades no existen.
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    // Extrae la información del remitente del mismo lugar donde se encuentra el mensaje.
    const senderInfo = req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0];

    // Si el mensaje existe, llama al servicio `messageHandler` para procesarlo.
    if (message) {
      await messageHandler.handleIncomingMessage(message, senderInfo);
    }
    // Responde con un estado 200 para indicar que la solicitud fue procesada exitosamente.
    res.sendStatus(200);
  }

  // Método para manejar solicitudes GET usadas para la verificación del webhook.
  verifyWebhook(req, res) {
    // Extrae los parámetros de consulta enviados por el proveedor del webhook.
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Verifica que el modo sea "subscribe" y el token coincida con el token de verificación configurado.
    if (mode === "subscribe" && token === config.WEBHOOK_VERIFY_TOKEN) {
      // Si la verificación es exitosa, responde con el desafío (challenge) proporcionado.
      res.status(200).send(challenge);
      console.log("Webhook verified successfully!");
    } else {
      // Si la verificación falla, responde con un estado 403 para denegar el acceso.
      res.sendStatus(403);
    }
  }
}

// Exporta una nueva instancia de `WebhookController` para ser usada en las rutas.
export default new WebhookController();
