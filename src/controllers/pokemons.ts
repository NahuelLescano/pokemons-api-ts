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
      .json({ message: error.message, result: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, result: result.data });
};

export const getPokemonById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, error } = await tryCatch(getById(Number(id)));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, result: [] });
    return;
  }

  res.json({ message: messages.SUCCESS, result });
};

export const createPokemon = async (req: Request, res: Response) => {
  const { name, type, rarity } = req.body;
  const { result, error } = await tryCatch(create(name, type, rarity));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, result: [] });
    return;
  }

  res
    .status(HttpStatusCodes.CREATED)
    .json({ message: messages.CREATED_SUCCESS, result });
};

export const updatePokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;

  const { result, error } = await tryCatch(
    update(Number(id), name, type, rarity),
  );

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, result: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    result,
  });
};

export const patchPokemon = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;

  const { result, error } = await tryCatch(
    patch(Number(id), name, type, rarity),
  );

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, result: [] });
    return;
  }

  res.json({
    message: messages.UPDATED_SUCCESS,
    result,
  });
};

export const deletePokemon = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { result, error } = await tryCatch(drop(Number(id)));

  if (error) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ message: error.message, result: [] });
    return;
  }

  res.json({
    message: messages.DELETED_SUCCESS,
    result,
  });
};
