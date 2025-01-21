import sendToWhatsApp from "../services/httpRequest/sendToWhatsApp.js";
// Importa una función que maneja la lógica para enviar datos a la API de WhatsApp.

class WhatsAppService {
  /**
   * Envía un mensaje de texto simple a un destinatario en WhatsApp.
   * @param {string} to - Número de teléfono del destinatario.
   * @param {string} body - Cuerpo del mensaje.
   * @param {string} messageId - ID del mensaje (opcional, no usado aquí).
   */
  async sendMessage(to, body, messageId) {
    const data = {
      messaging_product: "whatsapp",
      to,
      text: {
        //body
        body: body,
      },
    };

    await sendToWhatsApp(data); // Envía la solicitud a la función que interactúa con la API.
  }

  /**
   * Envía un mensaje interactivo con botones a un destinatario.
   * @param {string} to - Número de teléfono del destinatario.
   * @param {string} bodyText - Texto que acompaña a los botones.
   * @param {Array} buttons - Lista de botones interactivos.
   */
  async sendInteractiveButtons(to, bodyText, buttons) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons,
        },
      },
    };

    await sendToWhatsApp(data);
  }

  /////////////////
  async sendInteractiveList(to, bodyText, sections) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: bodyText },
        action: {
          button: "Seleccionar",
          sections: sections,
        },
      },
    };

    try {
      const response = await sendToWhatsApp(data);
      console.log("Mensaje interactivo enviado:", response);
    } catch (error) {
      console.error("Error al enviar mensaje interactivo:", error.message);
    }
  }

  /**
   * Envía un mensaje de medios (imagen, audio, video o documento).
   * @param {string} to - Número de teléfono del destinatario.
   * @param {string} type - Tipo de medio ('image', 'audio', 'video', 'document').
   * @param {string} mediaUrl - URL del medio a enviar.
   * @param {string} caption - Subtítulo opcional para el medio.
   */
  async sendMediaMessage(to, type, mediaUrl, caption) {
    const mediaObject = {}; // Inicializa un objeto para el contenido del medio.

    try {
      // Define la estructura del objeto según el tipo de medio.
      switch (type) {
        case "image":
          mediaObject.image = { link: mediaUrl, caption: caption };
          break;
        case "audio":
          mediaObject.audio = { link: mediaUrl };
          break;
        case "video":
          mediaObject.video = { link: mediaUrl, caption: caption };
          break;
        case "document":
          mediaObject.document = {
            link: mediaUrl,
            caption: caption,
            filename: "medpet-file.pdf",
          };
          break;
        default:
          throw new Error("Not Supported Media Type");
      }

      const data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: type,
        ...mediaObject, // Combina el objeto del medio con los datos generales.
      };

      // Imprime los datos antes de enviarlos para depuración
      console.log(
        "Enviando los siguientes datos a WhatsApp:",
        JSON.stringify(data)
      );

      // Asegúrate de que sendToWhatsApp esté funcionando correctamente
      await sendToWhatsApp(data);
    } catch (error) {
      console.error("Error al enviar el mensaje multimedia:", error.message);
      throw new Error(
        "Hubo un problema al enviar el medio. Intenta de nuevo más tarde."
      );
    }
  }

  /**
   * Marca un mensaje como leído.
   * @param {string} messageId - ID del mensaje a marcar como leído.
   */
  async markAsRead(messageId) {
    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };

    await sendToWhatsApp(data);
  }

  /**
   * Envía un mensaje con un contacto.
   * @param {string} to - Número de teléfono del destinatario.
   * @param {Object} contact - Objeto de contacto que contiene detalles como nombre y número.
   */
  async sendContactMessage(to, contact) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "contacts",
      contacts: [contact],
    };

    await sendToWhatsApp(data);
  }

  /**
   * Envía un mensaje con la ubicación.
   * @param {string} to - Número de teléfono del destinatario.
   * @param {number} latitude - Latitud de la ubicación.
   * @param {number} longitude - Longitud de la ubicación.
   * @param {string} name - Nombre del lugar.
   * @param {string} address - Dirección del lugar.
   */
  async sendLocationMessage(to, latitude, longitude, name, address) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "location",
      location: {
        latitude: latitude,
        longitude: longitude,
        name: name,
        address: address,
      },
    };

    await sendToWhatsApp(data);
  }
}

export default new WhatsAppService(); // Exporta una instancia de la clase para su uso en otras partes del código.
