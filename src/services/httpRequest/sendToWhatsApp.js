import axios from "axios";
// Importa la biblioteca `axios` para manejar solicitudes HTTP.

import config from "../../config/env.js";
// Importa configuraciones desde un archivo externo que contiene variables de entorno (como la URL base, versión de la API, token de autenticación, etc.).

/**
 * Función que envía datos a la API de WhatsApp usando una solicitud HTTP POST.
 * @param {Object} data - Datos que contienen el mensaje y los detalles del destinatario.
 * @returns {Object} - Respuesta de la API de WhatsApp, si la solicitud es exitosa.
 */
const sendToWhatsApp = async (data) => {
  // Construye la URL de la API usando las configuraciones definidas.
  const baseUrl = `${config.BASE_URL}/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`;
  console.log(data,"::::::::::::::::::::::::::::::::::::::::::::");
  // Configura los encabezados para la solicitud, incluyendo el token de autenticación.
  const headers = {
    Authorization: `Bearer ${config.API_TOKEN}`, // Autenticación Bearer usando un token seguro.
  };

  try {
    // Realiza la solicitud POST usando axios, pasando la URL, encabezados, y datos.
    const response = await axios({
      method: "POST", // Tipo de solicitud HTTP.
      url: baseUrl, // URL construida para la API.
      headers: headers, // Encabezados de la solicitud para autorización.
      data, // Datos que se envían en el cuerpo de la solicitud.
    });
    return response.data; // Devuelve la respuesta del servidor.
  } catch (error) {
    console.error(error); // Muestra el error en consola si ocurre un problema.
  }
};

export default sendToWhatsApp;
// Exporta la función para ser usada en otros módulos.
