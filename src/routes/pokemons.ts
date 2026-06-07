import { type Request, type Response, Router } from "express";
import { POKEMONS, HttpStatusCodes, messages } from "../consts";
import type { Pokemon } from "../models";
import { getAllPokemons, getPokemonById } from "../controllers/pokemons";

export const pokemonRouter = Router();
export default pokemonRouter;

pokemonRouter.get("/", (req: Request, res: Response) => {
  const { type } = req.query;
  const { message, data } = getAllPokemons(type as string | undefined);

  res.json({ message, data });
});

pokemonRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, data } = getPokemonById(Number(id));

  res.json({ message, data });
});

pokemonRouter.post("/", (req: Request, res: Response) => {
  const { name, type } = req.body;
  if (!name || !type) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.NAME_TYPE_REQUIRED, data: [] });
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

pokemonRouter.put("/", (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ message: messages.NOT_FOUND, data: [] });
    return;
  }

  const { name, type } = req.body;
  if (!name || !type) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.NAME_TYPE_REQUIRED, data: [] });
    return;
  }

  POKEMONS[pokemonIndex] = { id: Number(id), name, type };
  res.json({
    message: messages.UPDATED_SUCCESS,
    data: POKEMONS[pokemonIndex],
  });
});

pokemonRouter.patch("/", (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ message: messages.NOT_FOUND, data: [] });
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

pokemonRouter.delete("/", (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ message: messages.INVALID_ID, data: [] });
    return;
  }

  const deletedPokemon = POKEMONS.splice(pokemonIndex, 1)[0];
  res.json({
    message: messages.DELETED_SUCCESS,
    data: deletedPokemon,
  });
});
