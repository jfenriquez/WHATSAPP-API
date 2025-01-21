import dotenv from "dotenv";

// Carga las variables de entorno desde un archivo .env
dotenv.config();

/**
 * Valida que las variables de entorno requeridas estén definidas.
 * Lanza un error si alguna de ellas falta, proporcionando mejor seguridad y control.
 */
const requiredEnvVariables = [
  "WEBHOOK_VERIFY_TOKEN",
  "API_TOKEN",
  "BUSINESS_PHONE",
  "API_VERSION",
  "PORT",
  "BASE_URL",
  "OPENAI_API_KEY",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

export default {
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
  API_TOKEN: process.env.API_TOKEN,
  BUSINESS_PHONE: process.env.BUSINESS_PHONE,
  API_VERSION: process.env.API_VERSION,
  PORT: parseInt(process.env.PORT, 10) || 3000, // Garantiza que el puerto sea un número entero
  BASE_URL: process.env.BASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
