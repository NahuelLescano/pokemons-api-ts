import { loadEnvFile } from "node:process";

loadEnvFile();

export const {
  PORT = 4000,
  API_V1 = "/api/v1/",
} = process.env;
