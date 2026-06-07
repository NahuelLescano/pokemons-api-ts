import type { Pokemon } from "../models";

export const POKEMONS: Pokemon[] = [
  { id: 1, name: "Bulbasaur", type: "Grass/Poison", rarity: "Common", deleted: false },
  { id: 2, name: "Charmander", type: "Fire", rarity: "Common", deleted: false },
  { id: 3, name: "Squirtle", type: "Water", rarity: "Common", deleted: false },
  { id: 4, name: "Pikachu", type: "Electric", rarity: "Uncommon", deleted: false },
  { id: 5, name: "Eevee", type: "Normal", rarity: "Uncommon", deleted: false },
  { id: 6, name: "Mewtwo", type: "Psychic", rarity: "Legendary", deleted: false },
] as const;

export default POKEMONS;
