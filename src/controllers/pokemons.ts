import type { Request, Response } from "express";
import { HttpStatusCodes, messages } from "../consts";
import { getAll, getById, create, update, patch, drop } from "../database";
import { tryCatch } from "../tryCatch";

export const getAllPokemons = async (req: Request, res: Response) => {
  const { type } = req.query;
  const { result, error } = await tryCatch(getAll(type as string | undefined));
  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, pokemons: result.pokemons });
};

export const getPokemonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pokeId = Number(id);
  if (isNaN(pokeId)) {
    throw new Error(messages.INVALID_ID);
  }

  const { result, error } = await tryCatch(getById(pokeId));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, pokemon: result.pokemon });
};

export const createPokemon = async (req: Request, res: Response) => {
  const { name, type, rarity } = req.body;
  const { result, error } = await tryCatch(create(name, type, rarity));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res
    .status(HttpStatusCodes.CREATED)
    .json({ message: messages.CREATED_SUCCESS, pokemon: result.pokemon });
};

export const updatePokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pokeId = Number(id);
  if (isNaN(pokeId)) {
    throw new Error(messages.INVALID_ID);
  }

  const { name, type, rarity } = req.body;
  if (!name || !type || !rarity) {
    throw new Error(messages.INVALID_POKEMON);
  }

  const { result, error } = await tryCatch(update(pokeId, name, type, rarity));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    pokemon: result.pokemon,
  });
};

export const patchPokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pokeId = Number(id);
  if (isNaN(pokeId)) {
    throw new Error(messages.INVALID_ID);
  }

  const { name, type, rarity } = req.body;
  if (!name && !type) {
    throw new Error(messages.PATCH_FIELD_REQUIRED);
  }

  const { result, error } = await tryCatch(patch(pokeId, name, type, rarity));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    pokemon: result.pokemon,
  });
};

export const deletePokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pokeId = Number(id);
  if (isNaN(pokeId)) {
    throw new Error(messages.INVALID_ID);
  }

  const { result, error } = await tryCatch(drop(pokeId));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, pokemon: [] });
    return;
  }

  res.json({
    message: messages.DELETED_SUCCESS,
    pokemon: result.pokemon,
  });
};
