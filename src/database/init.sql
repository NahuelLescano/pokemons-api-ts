-- pokemon_types
CREATE TABLE IF NOT EXISTS pokemon_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- pokemon_rarities
CREATE TABLE IF NOT EXISTS pokemon_rarities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- pokemons
CREATE TABLE IF NOT EXISTS pokemons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type_id INTEGER NOT NULL REFERENCES pokemon_types(id),
  rarity_id INTEGER NOT NULL REFERENCES pokemon_rarities(id),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Seed types
INSERT INTO pokemon_types (name) VALUES
  ('Fire'), ('Water'), ('Grass'), ('Electric'),
  ('Psychic'), ('Grass/Poison'), ('Normal')
ON CONFLICT (name) DO NOTHING;

-- Seed rarities
INSERT INTO pokemon_rarities (name) VALUES
  ('Common'), ('Uncommon'), ('Rare'), ('Legendary')
ON CONFLICT (name) DO NOTHING;

-- Seed pokemons
INSERT INTO pokemons (name, type_id, rarity_id) VALUES
  ('Bulbasaur',   (SELECT id FROM pokemon_types WHERE name = 'Grass/Poison'), (SELECT id FROM pokemon_rarities WHERE name = 'Common')),
  ('Charmander',  (SELECT id FROM pokemon_types WHERE name = 'Fire'),        (SELECT id FROM pokemon_rarities WHERE name = 'Common')),
  ('Squirtle',    (SELECT id FROM pokemon_types WHERE name = 'Water'),       (SELECT id FROM pokemon_rarities WHERE name = 'Common')),
  ('Pikachu',     (SELECT id FROM pokemon_types WHERE name = 'Electric'),    (SELECT id FROM pokemon_rarities WHERE name = 'Uncommon')),
  ('Eevee',       (SELECT id FROM pokemon_types WHERE name = 'Normal'),      (SELECT id FROM pokemon_rarities WHERE name = 'Uncommon')),
  ('Mewtwo',      (SELECT id FROM pokemon_types WHERE name = 'Psychic'),     (SELECT id FROM pokemon_rarities WHERE name = 'Legendary'))
ON CONFLICT (id) DO NOTHING;
