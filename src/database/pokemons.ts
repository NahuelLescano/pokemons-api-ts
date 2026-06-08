import { messages, POKEMONS } from "../consts";
import type { Pokemon, PokemonRarity, PokemonType } from "../types";

type GetAllPokemonsResponse = {
  data: Pokemon[];
};
export const getAll = async (type?: string): Promise<GetAllPokemonsResponse> => {
  const pokemons = POKEMONS.filter((p) => p.deleted === false);

  if (type) {
    const pokemonsByType = pokemons.filter((p) =>
      p.type.toLowerCase().includes(type.toLowerCase()),
    );
    return {
      data: pokemonsByType,
    };
  }

  return {
    data: pokemons,
  };
};

type GetPokemonByIdResponse = {
  data: (typeof POKEMONS)[number] | null;
};
export const getById = async (id: number): Promise<GetPokemonByIdResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  const pokemon = POKEMONS.find((p) => p.id === id);
  if (!pokemon) {
    throw new Error(messages.NOT_FOUND);
  }

  return {
    data: pokemon,
  };
};

interface PokemonResponse {
  data: Pokemon;
}

export const create = async (name: string, type: PokemonType, rarity: PokemonRarity): Promise<PokemonResponse> => {
  const newPokemon: Pokemon = {
    id: POKEMONS.length + 1,
    name,
    type,
    rarity,
    deleted: false,
  };
  POKEMONS.push(newPokemon);
  return {
    data: newPokemon,
  };
};

export const update = async (id: number, name: string, type: PokemonType, rarity: PokemonRarity): Promise<PokemonResponse> => {
  if (isNaN(Number(id))) {
    throw new Error(messages.INVALID_ID);
  }

  if (!name || !type || !rarity) {
    throw new Error(messages.INVALID_POKEMON);
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    throw new Error(messages.NOT_FOUND);
  }

  POKEMONS[pokemonIndex] = { id, name, type, rarity, deleted: false };
  return {
    data: POKEMONS[pokemonIndex],
  };
};

export const patch = async (id: number, name?: string, type?: PokemonType, rarity?: PokemonRarity): Promise<PokemonResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  if (!name && !type) {
    throw new Error(messages.PATCH_FIELD_REQUIRED);
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === id);
  if (pokemonIndex === -1) {
    throw new Error(messages.NOT_FOUND);
  }

  if (name) POKEMONS[pokemonIndex].name = name;
  if (type) POKEMONS[pokemonIndex].type = type;
  if (rarity) POKEMONS[pokemonIndex].rarity = rarity;

  return {
    data: POKEMONS[pokemonIndex],
  };
};

export const drop = async (id: number): Promise<PokemonResponse> => {
  if (isNaN(id)) {
    throw new Error(messages.INVALID_ID);
  }

  const pokemonIndex = POKEMONS.findIndex((p) => p.id === Number(id));
  if (pokemonIndex === -1) {
    throw new Error(messages.NOT_FOUND);
  }

  const deletedPokemon = {
    ...POKEMONS[pokemonIndex],
    deleted: true,
  };
  POKEMONS[pokemonIndex] = deletedPokemon;

  return {
    data: deletedPokemon,
  };
};
