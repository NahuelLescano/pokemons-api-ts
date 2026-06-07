import { messages, POKEMONS } from "../consts";
import { Pokemon } from "../models";

type GetAllPokemonsResponse = {
  message: string;
  data: typeof POKEMONS;
};
export const getAllPokemons = (type?: string): GetAllPokemonsResponse => {
  if (type) {
    const pokemonsByType = POKEMONS.filter((p) =>
      p.type.toLowerCase().includes(type.toLowerCase()),
    );
    return {
      message: messages.SUCCESS,
      data: pokemonsByType,
    };
  }

  return {
    message: messages.SUCCESS,
    data: POKEMONS,
  };
};

type GetPokemonByIdResponse = {
  message: string;
  data: (typeof POKEMONS)[number] | null;
};
export const getPokemonById = (id: number): GetPokemonByIdResponse => {
  if (isNaN(id)) {
    return {
      message: messages.INVALID_ID,
      data: null,
    };
  }

  const pokemon = POKEMONS.find((p) => p.id === id);
  if (!pokemon) {
    return {
      message: messages.NOT_FOUND,
      data: null,
    };
  }

  return {
    message: messages.SUCCESS,
    data: pokemon,
  };
};

export const createPokemon = (name: string, type: string) => {
  const newPokemon: Pokemon = {
    id: POKEMONS.length + 1,
    name,
    type,
  };
  POKEMONS.push(newPokemon);
  return {
    message: messages.CREATED_SUCCESS,
    data: newPokemon,
  };
};
