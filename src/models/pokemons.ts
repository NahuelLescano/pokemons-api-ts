export interface Pokemon {
  id: number;
  name: string;
  type: string;
}

export const POKEMONS: Pokemon[] = [
  { id: 1, name: "Bulbasaur", type: "Grass/Poison" },
  { id: 2, name: "Charmander", type: "Fire" },
  { id: 3, name: "Squirtle", type: "Water" },
  { id: 4, name: "Pikachu", type: "Electric" },
  { id: 5, name: "Eevee", type: "Normal" },
] as const;

export default POKEMONS;
