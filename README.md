# Pokémon API

API REST con Express + TypeScript + PostgreSQL.

## Requisitos

- Node.js 22+
- pnpm
- Docker (opcional, para DB o todo)

## Configuración

Variables de entorno en `.env`:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=pokemon
DB_PASSWORD=pokemon
DB_NAME=pokemondb
```

## Levantar todo con Docker

```bash
# Solo la base de datos
docker compose up db -d

# API + DB (rebuild si cambió código)
docker compose up --build -d

# Ver logs
docker compose logs -f api

# Bajar todo
docker compose down -v
```

## Desarrollo local

```bash
# Instalar deps
pnpm install

# Levantar solo DB (Docker)
docker compose up db -d

# API en modo watch
pnpm dev
```

La API queda en `http://localhost:4000/api/v1/pokemons`.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/pokemons` | Listar todos |
| GET | `/api/v1/pokemons?type=fire` | Filtrar por tipo |
| GET | `/api/v1/pokemons/:id` | Obtener por ID |
| POST | `/api/v1/pokemons` | Crear |
| PUT | `/api/v1/pokemons/:id` | Actualizar completo |
| PATCH | `/api/v1/pokemons/:id` | Actualizar parcial |
| DELETE | `/api/v1/pokemons/:id` | Soft delete |

### Ejemplos

```bash
# Listar
curl http://localhost:4000/api/v1/pokemons

# Filtrar por tipo
curl "http://localhost:4000/api/v1/pokemons?type=fire"

# Obtener uno
curl http://localhost:4000/api/v1/pokemons/1

# Crear
curl -X POST http://localhost:4000/api/v1/pokemons \
  -H "Content-Type: application/json" \
  -d '{"name": "Gengar", "type": "Psychic", "rarity": "Rare"}'

# Actualizar
curl -X PUT http://localhost:4000/api/v1/pokemons/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Bulbasaur", "type": "Grass/Poison", "rarity": "Uncommon"}'

# Patch
curl -X PATCH http://localhost:4000/api/v1/pokemons/1 \
  -H "Content-Type: application/json" \
  -d '{"rarity": "Legendary"}'

# Eliminar (soft delete)
curl -X DELETE http://localhost:4000/api/v1/pokemons/1
```

## Estructura BD

Tablas:
- `pokemon_types` (id, name) — tipos separados
- `pokemon_rarities` (id, name) — rarezas
- `pokemons` (id, name, type_id, rarity_id, deleted)

Seed data incluido (6 pokemons iniciales).