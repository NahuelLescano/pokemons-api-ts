export type PokemonType = 
  "Fire"         |
  "Water"        |
  "Grass"        |
  "Electric"     |
  "Psychic"      |
  "Grass/Poison" |
  "Normal";

export type PokemonRarity = "Common" | "Uncommon" | "Rare" | "Legendary";

export interface Pokemon {
  id: number;
  name: string;
  type: PokemonType;
  rarity: PokemonRarity;
  deleted: boolean;
}

export default Pokemon;
