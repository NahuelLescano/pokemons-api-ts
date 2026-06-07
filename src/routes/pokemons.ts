import { type Request, type Response, Router } from "express";
import { POKEMONS, HttpStatusCodes, messages } from "../consts";
import type { Pokemon } from "../models";
import {
  createPokemon,
  deletePokemon,
  getAllPokemons,
  getPokemonById,
  partiallyUpdatePokemon,
  updatePokemon,
} from "../controllers";

export const pokemonRouter = Router();

pokemonRouter.get("/", (req: Request, res: Response) => {
  const { type } = req.query;
  const { data } = getAllPokemons(type as string | undefined);

  res.json({ message: messages.SUCCESS, data });
});

pokemonRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  let data: (typeof POKEMONS)[number] | null = null;
  try {
    const result = getPokemonById(Number(id));
    data = result.data;
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: error.message, data: [] });
      return;
    }
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: "Unknown error has happened", data: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, data });
});

pokemonRouter.post("/", (req: Request, res: Response) => {
  const { name, type, rarity } = req.body;
  const data = createPokemon(name, type, rarity);

  res
    .status(HttpStatusCodes.CREATED)
    .json({ message: messages.CREATED_SUCCESS, data });
});

pokemonRouter.put("/", (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;

  let poke: Pokemon | null = null;

  try {
    const result = updatePokemon(Number(id), name, type, rarity);
    poke = result.data;
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: error.message, data: [] });
      return;
    }
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: "Unknown error has happened", data: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    data: poke,
  });
});

pokemonRouter.patch("/", (req: Request, res: Response) => {
  const { id } = req.params;

  let data: Pokemon | null = null;

  try {
    const result = partiallyUpdatePokemon(
      Number(id),
      req.body.name,
      req.body.type,
      req.body.rarity,
    );
    data = result.data;
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: error.message, data: [] });
      return;
    }
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: "Unknown error has happened", data: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    data,
  });
});

pokemonRouter.delete("/", (req: Request, res: Response) => {
  const { id } = req.params;

  let deletedPokemon: Pokemon | null = null;
  try {
    const result = deletePokemon(Number(id));
    deletedPokemon = result.data;
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: error.message, data: [] });
      return;
    }
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: "Unknown error has happened", data: [] });
    return;
  }

  res.json({
    message: messages.DELETED_SUCCESS,
    data: deletedPokemon,
  });
});
