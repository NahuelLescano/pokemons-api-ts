import { messages } from "../consts";
import { pool } from "./connection";
import type { Pokemon, PokemonRarity, PokemonType } from "../types";
import { tryCatch } from "../tryCatch";

type GetAllPokemonsResponse = {
  pokemons: Pokemon[];
};

export const getAll = async (
  type?: string,
): Promise<GetAllPokemonsResponse> => {
  let query = `
    SELECT p.id, p.name, pt.name AS type, pr.name AS rarity
    FROM pokemons p
    JOIN pokemon_types pt ON p.type_id = pt.id
    JOIN pokemon_rarities pr ON p.rarity_id = pr.id
    WHERE p.deleted = false
  `;
  const params: string[] = [];

  if (type) {
    query += " AND LOWER(pt.name) LIKE LOWER($1)";
    params.push(`%${type}%`);
  }

  query += " ORDER BY p.id";

  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));
  if (error) {
    throw new Error(messages.NOT_FOUND);
  }

  const { rows } = result;
  return {
    pokemons: rows,
  };
};

type PokemonResponse = {
  pokemon: Pokemon | null;
};

export const getById = async (id: number): Promise<PokemonResponse> => {
  const query = `
    SELECT p.id, p.name, pt.name AS type, pr.name AS rarity, p.deleted
    FROM pokemons p
    JOIN pokemon_types pt ON p.type_id = pt.id
    JOIN pokemon_rarities pr ON p.rarity_id = pr.id
    WHERE p.id = $1
  `;

  const params: string[] = [id.toString()];
  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));

  if (error) {
    throw new Error(messages.NOT_FOUND);
  }

  const { rows, rowCount } = result;
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const pokemonById: Pokemon = {
    id: rows[0].id,
    name: rows[0].name,
    type: rows[0].type,
    rarity: rows[0].rarity,
    deleted: rows[0].deleted,
  };

  return {
    pokemon: pokemonById,
  };
};

export const create = async (
  name: string,
  type: PokemonType,
  rarity: PokemonRarity,
): Promise<PokemonResponse> => {
  const query = `
    INSERT INTO pokemons (name, type_id, rarity_id)
    VALUES (
      $1,
      (SELECT id FROM pokemon_types WHERE name = $2),
      (SELECT id FROM pokemon_rarities WHERE name = $3)
    )
    RETURNING id
  `;
  const params: string[] = [name, type, rarity];

  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));

  if (error) {
    throw new Error(messages.CREATE_FAILED);
  }

  const { rows, rowCount } = result;
  if (rowCount === 0) {
    throw new Error(messages.CREATE_FAILED);
  }

  const pokemonCreated: Pokemon = {
    id: rows[0].id,
    name: rows[0].name,
    type: rows[0].type,
    rarity: rows[0].rarity,
    deleted: rows[0].deleted,
  };

  return {
    pokemon: pokemonCreated,
  };
};

export const update = async (
  id: number,
  name: string,
  type: PokemonType,
  rarity: PokemonRarity,
): Promise<PokemonResponse> => {
  const query = `
    UPDATE pokemons SET
    name = $1,
      type_id = (SELECT id FROM pokemon_types WHERE name = $2),
      rarity_id = (SELECT id FROM pokemon_rarities WHERE name = $3)
    WHERE id = $4 AND deleted = false
  `;
  const params: string[] = [name, type, rarity, id.toString()];
  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));

  if (error) {
    throw new Error(messages.UPDATED_FAILED);
  }

  const { rows, rowCount } = result;
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const pokemonUpdated: Pokemon = {
    id: rows[0].id,
    name: rows[0].name,
    type: rows[0].type,
    rarity: rows[0].rarity,
    deleted: rows[0].deleted,
  };

  return {
    pokemon: pokemonUpdated,
  };
};

export const patch = async (
  id: number,
  name?: string,
  type?: PokemonType,
  rarity?: PokemonRarity,
): Promise<PokemonResponse> => {
  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (name) {
    sets.push(`name = $${idx++}`);
    params.push(name);
  }
  if (type) {
    sets.push(
      `type_id = (SELECT id FROM pokemon_types WHERE name = $${idx++})`,
    );
    params.push(type);
  }
  if (rarity) {
    sets.push(
      `rarity_id = (SELECT id FROM pokemon_rarities WHERE name = $${idx++})`,
    );
    params.push(rarity);
  }
  params.push(id);

  const query = `
    UPDATE pokemons SET ${sets.join(", ")}
    WHERE id = $${idx} AND deleted = false
  `;
  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));
  
  if (error) {
    throw new Error(messages.UPDATED_FAILED);
  }

  const { rows, rowCount } = result;
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const pokemonPatched: Pokemon = {
    id: rows[0].id,
    name: rows[0].name,
    type: rows[0].type,
    rarity: rows[0].rarity,
    deleted: rows[0].deleted,
  };

  return {
    pokemon: pokemonPatched,
  };
};

export const drop = async (id: number): Promise<PokemonResponse> => {
  const query = `
    UPDATE pokemons SET deleted = true
    WHERE id = $1 AND deleted = false
  `;
  const params: string[] = [id.toString()];
  const { result, error } = await tryCatch(pool.query<Pokemon>(query, params));
  if (error) {
    throw new Error(messages.DELETED_FAILED);
  }

  const { rows, rowCount } = result;
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const pokemonDeleted: Pokemon = {
    id: rows[0].id,
    name: rows[0].name,
    type: rows[0].type,
    rarity: rows[0].rarity,
    deleted: rows[0].deleted,
  }

  return {
    pokemon: pokemonDeleted,
  };
};
