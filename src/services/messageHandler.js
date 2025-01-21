import whatsappService from "./whatsappService.js"; // Importa un servicio para enviar mensajes a WhatsApp.
import appendToSheet from "./googleSheetsService.js"; // Importa un servicio para guardar datos en Google Sheets.
import openAiService from "./openAiService.js"; // Importa un servicio para interactuar con la API de OpenAI.

class MessageHandler {
  // Constructor para inicializar los estados para agendar citas y asistente virtual.
  constructor() {
    this.appointmentState = {}; // Guarda el estado del flujo de agendamiento de citas por usuario.
    this.assistandState = {}; // Guarda el estado del flujo de asistente virtual por usuario.
    this.MultimediaMenuState = {}; ////este menu sirve con mas de tres opciones
  }

  // Método principal para manejar mensajes entrantes.
  async handleIncomingMessage(message, senderInfo) {
    console.log("message", message);
    // Verifica si el mensaje es de texto.
    if (message?.type === "text") {
      const incomingMessage = message.text.body.toLowerCase().trim(); // Normaliza el texto del mensaje.

      // Lógica para manejar saludos y diferentes flujos de interacción.
      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo); // Envía un mensaje de bienvenida.
        await this.sendWelcomeMenu(message.from); // Envía un menú de opciones.
      } else if (incomingMessage === "media") {
        await this.sendMedia(message.from); // Envía un ejemplo de medios.
      } else if (this.appointmentState[message.from]) {
        await this.handleAppointmentFlow(message.from, incomingMessage); // Maneja el flujo de citas.
      } else if (this.assistandState[message.from]) {
        await this.handleAssistandFlow(message.from, incomingMessage); // Maneja el flujo del asistente.
      } else if (this.MultimediaMenuState[message.from]) {
        await this.handleMultimediaOption(message.from, incomingMessage);
      } else {
        await this.handleMenuOption(message.from, incomingMessage); // Maneja otras opciones del menú.
      }
      await whatsappService.markAsRead(message.id); // Marca el mensaje como leído.
    } else if (message?.type === "interactive") {
      const option =
        message?.interactive?.button_reply?.id ||
        message?.interactive?.list_reply?.id; // Procesa respuestas interactivas.
      await this.handleMenuOption(message.from, option);
      await whatsappService.markAsRead(message.id);
    }
  }

  // Verifica si un mensaje es un saludo.
  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  // Obtiene el nombre del remitente o el ID de WhatsApp si el nombre no está disponible.
  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  // Envía un mensaje de bienvenida personalizado.
  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = `Hola ${name}, bienvenido a nuestra plataforma. ¿En qué podemos ayudarte hoy?`;
    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  // Envía un menú interactivo de bienvenida.
  async sendWelcomeMenu(to) {
    const menuMessage = "📅 Gestión de Citas";
    /* const buttons = [
      { type: "reply", reply: { id: "option_1", title: "Agendar" } },
      { type: "reply", reply: { id: "option_2", title: "Consultar" } },
      { type: "reply", reply: { id: "option_3", title: "Ubicación" } },     
    ]; */
    const sections = [
      {
        title: menuMessage,
        rows: [
          {
            id: "option_1",
            title: "📅 Agendar Cita",
            description: "Agendar una cita para atención",
          },
          {
            id: "option_2",
            title: "🔍 Consultar Cita",
            description: "Consultar el estado de una cita agendada",
          },
          {
            id: "option_3",
            title: "📍 Ubicación",
            description: "Conocer nuestra ubicación",
          },
        ],
      },
      {
        title: "📁 Recursos Multimedia", // Título de la sección de recursos multimedia
        rows: [
          {
            id: "option_4",
            title: "📄 PDF",
            description: "Descargar manual en formato PDF",
          },
          {
            id: "send_audio",
            title: "🎧 Audio",
            description: "Escuchar un archivo de audio",
          },
          {
            id: "send_image",
            title: "🖼 Imagen",
            description: "Ver una imagen",
          },
          { id: "send_video", title: "📹 Video", description: "Ver un video" },
        ],
      },
    ];

    await whatsappService.sendInteractiveList(
      to,
      "Selecciona una opción:",
      sections
    );

    //await whatsappService.sendInteractiveButtons(to, menuMessage, buttons);
    //await whatsappService.sendInteractiveList(to, menuMessage, buttons);
  }

  // Maneja las opciones del menú.
  async handleMenuOption(to, option) {
    console.log(option);
    let response;
    switch (option) {
      case "option_1":
        this.appointmentState[to] = { step: "name" };
        response = "Por favor, ingresa tu nombre:";
        break;
      case "option_2":
        this.assistandState[to] = { step: "question" };
        response = "Realiza tu consulta";
        break;
      case "option_3":
        response = "Te esperamos en nuestra sucursal.";
        await this.sendLocation(to);
        break;
      case "option_4":
        // Responde antes de enviar el medio
        response = "Aquí tienes el archivo multimedia que solicitaste.";
        await this.sendMedia(to, option); // Luego, envía el medio

        break;
      default:
        response =
          "Lo siento, no entendí tu selección, Por Favor, elige una de las opciones del menú.";
    }
    await whatsappService.sendMessage(to, response);
  }

  // Envía diferentes tipos de medios (audio, imagen, video o documento).
  async sendMedia(to, option) {
    if (option === "option_4") {
      const mediaUrl =
        "https://mintic.gov.co/micrositios/conectividad-para-cambiar-vidas/835/articles-382635_proyectos_tipo_1_convocatoria_1_00.pdf";
      const caption = "¡Esto es un pdf!";
      const type = "pdf";
      await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
    } else if (option === "option_5") {
      const mediaUrl = "https://i.blogs.es/ceda9c/dalle/450_1000.jpg";
      const caption = "¡Esto es una video!";
      const type = "image";
      await whatsappService.sendMediaMessage(to, type, mediaUrl, caption);
    }
  }

  // Completa el proceso de agendamiento de citas.
  completeAppointment(to) {
    const appointment = this.appointmentState[to];
    delete this.appointmentState[to];
    const userData = [
      to,
      appointment.name,
      appointment.cedula,
      appointment.Type,
      appointment.Dia,
      appointment.reason,

      new Date().toISOString(),
    ];
    appendToSheet(userData); // Guarda los datos de la cita en Google Sheets.
    return `Gracias por agendar tu cita. Resumen de tu cita:\n\nNombre: ${appointment.name}\nCedula: ${appointment.cedula}\nTipo modalidad : ${appointment.Type}\nMotivo: ${appointment.reason}\n\nNos pondremos en contacto contigo para confirmar la disponibilidad para el ${appointment.Dia}. `;
  }

  // Maneja el flujo de agendamiento de citas paso a paso.
  async handleAppointmentFlow(to, message) {
    const state = this.appointmentState[to];
    let response;
    switch (state.step) {
      case "name":
        state.name = message;
        state.step = "cedula";
        response = "Gracias, Ahora, ¿Cuál es el numero de tu cedula?";
        break;
      case "cedula":
        state.cedula = message;
        state.step = "Type";
        response = "¿Modalidad de la cita (presencial o virtual)?";
        break;

      case "Type":
        state.Type = message;
        state.step = "Dia";
        response = "¿Fecha y hora preferida para la cita (dia/mes/año hh:mm)?";
        break;

      case "Dia":
        state.Dia = message;
        state.step = "reason";
        response = "¿Cuál es el motivo de la Consulta?";
        break;
      case "reason":
        state.reason = message;
        response = this.completeAppointment(to);
        break;
    }
    await whatsappService.sendMessage(to, response);
  }

  // Maneja el flujo de asistente virtual utilizando OpenAI.
  async handleAssistandFlow(to, message) {
    const state = this.assistandState[to];
    const response = await openAiService(message); // Llama a un servicio de IA para procesar la consulta.
    delete this.assistandState[to]; // Limpia el estado después de la consulta.
    await whatsappService.sendMessage(to, response);
  }

  // Envía información de contacto.
  async sendContact(to) {
    const contact = {
      // Datos de contacto de ejemplo.
      name: { formatted_name: "Nombre de Contacto" },
      phones: [{ phone: "+1234567890", type: "WORK" }],
    };
    await whatsappService.sendContactMessage(to, contact);
  }

  // Envía una ubicación fija como ejemplo.
  async sendLocation(to) {
    const latitude = 4.6108333333333;
    const longitude = 74.070277777778;
    const name = "Torre Colpatria";
    const address = "Cra. 7 #24-89, Bogotá";
    await whatsappService.sendLocationMessage(
      to,
      latitude,
      longitude,
      name,
      address
    );
  }
}

export default new MessageHandler(); // Exporta una instancia de `MessageHandler` para su uso.
