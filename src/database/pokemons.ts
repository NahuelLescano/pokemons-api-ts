import { messages } from "../consts";
import { pool } from "./connection";
import type { Pokemon, PokemonRarity, PokemonType } from "../types";

type GetAllPokemonsResponse = {
  data: Pokemon[];
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
  const { rows } = await pool.query<Pokemon>(query, params);
  return {
    data: rows,
  };
};

interface PokemonResponse {
  data: Pokemon | null;
}

export const getById = async (id: number): Promise<PokemonResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  const query = `
    SELECT p.id, p.name, pt.name AS type, pr.name AS rarity, p.deleted
    FROM pokemons p
    JOIN pokemon_types pt ON p.type_id = pt.id
    JOIN pokemon_rarities pr ON p.rarity_id = pr.id
    WHERE p.id = $1
  `;

  const params: string[] = [id.toString()];
  const { rows, rowCount } = await pool.query<Pokemon>(query, params);

  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  return {
    data: rows[0],
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

  const { rows, rowCount } = await pool.query<Pokemon>(query, params);

  if (rowCount === 0) {
  }

  const { data } = await getById(rows[0].id);

  return {
    data,
  };
};

export const update = async (
  id: number,
  name: string,
  type: PokemonType,
  rarity: PokemonRarity,
): Promise<PokemonResponse> => {
  if (isNaN(Number(id))) {
    throw new Error(messages.INVALID_ID);
  }

  if (!name || !type || !rarity) {
    throw new Error(messages.INVALID_POKEMON);
  }

  const query = `
    UPDATE pokemons SET
    name = $1,
      type_id = (SELECT id FROM pokemon_types WHERE name = $2),
      rarity_id = (SELECT id FROM pokemon_rarities WHERE name = $3)
    WHERE id = $4 AND deleted = false
  `;
  const params: string[] = [name, type, rarity, id.toString()];
  const { rowCount } = await pool.query<Pokemon>(query, params);

  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const { data } = await getById(id);

  return {
    data,
  };
};

export const patch = async (
  id: number,
  name?: string,
  type?: PokemonType,
  rarity?: PokemonRarity,
): Promise<PokemonResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  if (!name && !type) {
    throw new Error(messages.PATCH_FIELD_REQUIRED);
  }

  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (name) {
    sets.push(`name = $${idx++}`);
    params.push(name);
  }
  if (type) {
    sets.push(`type_id = (SELECT id FROM pokemon_types WHERE name = $${idx++})`);
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
  const { rowCount } = await pool.query<Pokemon>(query, params);
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const { data } = await getById(id);

  return {
    data,
  };
};

export const drop = async (id: number): Promise<PokemonResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  const query = `
    UPDATE pokemons SET deleted = true
    WHERE id = $1 AND deleted = false
  `;
  const params: string[] = [id.toString()];
  const { rowCount } = await pool.query<Pokemon>(query, params);
  if (rowCount === 0) {
    throw new Error(messages.NOT_FOUND);
  }

  const { data } = await getById(id);

  return {
    data,
  };
};
