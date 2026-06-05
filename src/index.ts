import express, { type Request, type Response } from "express";
import morgan from "morgan";
import { PORT, API_V1 } from "../config";
import { POKEMONS, type Pokemon } from "./models";
import { HttpStatusCodes, messages } from "./consts";

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.get(`${API_V1}pokemons`, (req: Request, res: Response) => {
  const { type } = req.query;
  if (type) {
    const pokemonsByType = POKEMONS.filter((p) =>
      p.type.toLowerCase().includes((type as string).toLowerCase()),
    );
    res.json({
      message: messages.SUCCESS,
      data: pokemonsByType,
    });
    return;
  }

  res.json({ message: messages.SUCCESS, data: POKEMONS });
});

server.get(`${API_V1}pokemons/:id`, (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemon = POKEMONS.find((p) => p.id === Number(id));
  if (!pokemon) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: messages.NOT_FOUND, data: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, data: pokemon });
});

server.post(`${API_V1}pokemons`, (req: Request, res: Response) => {
  const { name, type } = req.body;
  if (!name || !type) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.NAME_TYPE_REQUIRED, data: [] });
    return;
  }

  const newPokemon: Pokemon = {
    id: POKEMONS.length + 1,
    name,
    type,
  };
  POKEMONS.push(newPokemon);
  res
    .status(HttpStatusCodes.CREATED)
    .json({ message: messages.CREATED_SUCCESS, data: newPokemon });
});

server.put(`${API_V1}pokemons/:id`, (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: messages.NOT_FOUND, data: [] });
    return;
  }

  const { name, type } = req.body;
  if (!name || !type) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.NAME_TYPE_REQUIRED, data: [] });
    return;
  }

  POKEMONS[pokemonIndex] = { id: Number(id), name, type };
  res.json({
    message: messages.UPDATED_SUCCESS,
    data: POKEMONS[pokemonIndex],
  });
});

server.patch(`${API_V1}pokemons/:id`, (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: messages.NOT_FOUND, data: [] });
    return;
  }

  const { name, type } = req.body;
  if (!name && !type) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.PATCH_FIELD_REQUIRED, data: [] });
    return;
  }

  if (name) POKEMONS[pokemonIndex].name = name;
  if (type) POKEMONS[pokemonIndex].type = type;

  res.json({
    message: messages.UPDATED_SUCCESS,
    data: POKEMONS[pokemonIndex],
  });
});

server.delete(`${API_V1}/pokemons/:id`, (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: messages.INVALID_ID, data: [] });
    return;
  }
  
  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const deletedPokemon = POKEMONS.splice(pokemonIndex, 1)[0];
  res.json({
    message: messages.DELETED_SUCCESS,
    data: deletedPokemon,
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
