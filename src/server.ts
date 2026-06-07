import express from "express";
import morgan from "morgan";
import { PORT, API_V1 } from "../config";
import { pokemonRouter } from "./routes";

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use(`${API_V1}pokemons`, pokemonRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
