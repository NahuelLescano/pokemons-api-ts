import { PORT, API_V1 } from "../config";
import { pokemonRouter } from "./routes";
import { server } from "./middleware";

server.use(`${API_V1}pokemons`, pokemonRouter);

server.listen(PORT, () => {
  console.log(`API endpoint: http://localhost:${PORT}${API_V1}pokemons`);
});
