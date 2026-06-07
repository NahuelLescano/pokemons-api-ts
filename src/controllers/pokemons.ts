import { messages, POKEMONS } from "../consts";
import type { Pokemon, PokemonRarity, PokemonType } from "../models";

type GetAllPokemonsResponse = {
  data: Pokemon[];
};
export const getAllPokemons = (type?: string): GetAllPokemonsResponse => {
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
export const getPokemonById = (id: number): GetPokemonByIdResponse => {
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

export const createPokemon = (name: string, type: PokemonType, rarity: PokemonRarity): PokemonResponse => {
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

export const updatePokemon = (id: number, name: string, type: PokemonType, rarity: PokemonRarity): PokemonResponse => {
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

export const partiallyUpdatePokemon = (id: number, name?: string, type?: PokemonType, rarity?: PokemonRarity): PokemonResponse => {
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

export const deletePokemon = (id: number): PokemonResponse => {
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
