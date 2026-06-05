import { loadEnvFile } from "node:process";

loadEnvFile();

export const {
  PORT,
  API_V1 = "/api/v1/",
} = process.env;
