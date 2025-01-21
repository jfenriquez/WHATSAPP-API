import path from "path";  // Importa el módulo 'path' para manejar rutas de archivos.
import { google } from "googleapis";  // Importa la librería 'googleapis' para acceder a los servicios de Google.

const sheets = google.sheets("v4");  // Crea una instancia del servicio Google Sheets en su versión 4.

/**
 * Función asíncrona para agregar una nueva fila a una hoja de cálculo de Google Sheets.
 * @param {Object} auth - Objeto de autenticación de Google.
 * @param {string} spreadsheetId - ID de la hoja de cálculo.
 * @param {Array} values - Datos que se agregarán como una nueva fila.
 */
async function addRowToSheet(auth, spreadsheetId, values) {
  const request = {
    spreadsheetId,  // ID del documento de Google Sheets.
    range: "reservas!A2",  // Rango donde se agregará la nueva fila, comenzando desde la segunda fila de la hoja 'reservas'.
    valueInputOption: "RAW",  // Indica que los valores se insertan tal como se proporcionan.
    insertDataOption: "INSERT_ROWS",  // Opción para insertar nuevas filas.
    resource: {
      values: [values],  // Datos a insertar en formato de array.
    },
    auth,  // Autenticación para acceder al servicio de Google Sheets.
  };

  try {
    const response = await sheets.spreadsheets.values.append(request).data;  // Realiza la llamada para agregar los datos.
    return response;  // Devuelve la respuesta de la API.
  } catch (error) {
    console.error(error);  // Muestra cualquier error que ocurra durante la operación.
  }
}

/**
 * Función asíncrona para agregar datos a una hoja de cálculo utilizando credenciales locales.
 * @param {Array} data - Datos que se agregarán como una nueva fila en la hoja de cálculo.
 */
const appendToSheet = async (data) => {
  try {
    // Configuración de autenticación utilizando una clave de servicio.
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), "src/credentials", "credentials.json"),  // Ruta al archivo de credenciales.
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],  // Permisos necesarios para acceder a Google Sheets.
    });

    const authClient = await auth.getClient();  // Obtiene un cliente autenticado.
    const spreadsheetId = "15nh0lJcPl_3YxI2oWaLC5oW97N45r7b4S6yvaJKq9uI";  // ID específico de la hoja de cálculo.

    await addRowToSheet(authClient, spreadsheetId, data);  // Llama a la función para agregar una nueva fila con los datos proporcionados.
    return "Datos correctamente agregados";  // Devuelve un mensaje de éxito.
  } catch (error) {
    console.error(error);  // Muestra cualquier error que ocurra durante la operación.
  }
};

export default appendToSheet;  // Exporta la función 'appendToSheet' para su uso en otros archivos.
