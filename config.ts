import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch {}

export const {
  PORT = 4000,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  API_V1 = "/api/v1/",
} = process.env;
