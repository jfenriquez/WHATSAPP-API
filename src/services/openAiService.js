import OpenAI from "openai";  // Importa la biblioteca 'openai' para acceder a los servicios de la API de OpenAI.
import config from "../config/env.js";  // Importa las configuraciones de entorno desde un archivo separado para proteger claves API y configuraciones sensibles.

const client = new OpenAI({
  apiKey: config.OPENAI_API_KEY,  // Crea una instancia del cliente OpenAI utilizando la clave API desde las configuraciones.
});

/**
 * Función asíncrona que utiliza la API de OpenAI para generar respuestas basadas en un mensaje del usuario.
 * @param {string} message - El mensaje de entrada proporcionado por el usuario.
 * @returns {Promise<string>} - Devuelve una respuesta generada por la API de OpenAI.
 */
const openAiService = async (message) => {
  try {
    // Llamada a la API de OpenAI para crear una respuesta de chat.
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",  // Mensaje de configuración que define el comportamiento del asistente.
          content: 
            'Eres parte de un servicio de asistencia online y debes comportarte como un médico del hospital llamado "MediPlus+". ' +
            'Resuelve las preguntas lo más simple posible, con una explicación clara. Si es una emergencia o requiere atención inmediata, indica al usuario que acuda directamente al hospital o llame a los servicios de emergencia. ' +
            'Debes de responder en texto simple como si fuera un mensaje de un bot conversacional, no saludes, no generes conversación, ' +
            'solo responde a la pregunta del usuario.',
        },
        { role: "user", content: message },  // Mensaje del usuario que requiere una respuesta.
      ],
      model: "gpt-3.5-turbo",  // Especifica el modelo de lenguaje que se utilizará.
    });

    // Devuelve el contenido del mensaje generado por el asistente.
    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);  // Imprime cualquier error que ocurra durante la solicitud.
    return "Lo siento, hubo un problema con la solicitud. Por favor, intenta decir hola.";  // Mensaje de error amigable para el usuario.
  }
};

export default openAiService;  // Exporta la función 'openAiService' para usarla en otros módulos.
