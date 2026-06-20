import { Router } from "express";
import {
  createPokemon,
  deletePokemon,
  getAllPokemons,
  getPokemonById,
  patchPokemon,
  updatePokemon,
} from "../controllers";

export const pokemonRouter = Router();

pokemonRouter
  .get("/", getAllPokemons)
  .get("/:id", getPokemonById)
  .post("/", createPokemon)
  .put("/", updatePokemon)
  .patch("/", patchPokemon)
  .delete("/:id", deletePokemon);
