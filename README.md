# OKR Platform

Plataforma interna para gestionar Objetivos y Resultados Clave (OKRs) por equipo y trimestre.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, TypeScript, Vite, TanStack Query, Tailwind CSS, Radix UI |
| Backend | Node.js, Hono, Drizzle ORM |
| Base de datos | PostgreSQL |
| Deploy | Railway |

## Estructura del monorepo

```
okr-platform/
├── apps/
│   ├── api/          # API REST (Hono + Drizzle + PostgreSQL)
│   └── web/          # SPA React (Vite + TypeScript)
├── package.json      # Workspace raíz
└── railway.json      # Configuración de deploy
```

## Requisitos

- Node.js >= 22
- PostgreSQL
- npm

## Configuración local

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Crear el archivo `.env` en la raíz:

```env
DATABASE_URL=postgresql://localhost:5432/okr_platform
NODE_ENV=development
PORT=3001
```

3. Correr las migraciones y seedear la base de datos:

```bash
npm run db:migrate
npm run db:seed
```

4. Iniciar en modo desarrollo:

```bash
npm run dev
```

- API: http://localhost:3001
- Web: http://localhost:5173

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia API y Web en paralelo |
| `npm run dev:api` | Solo la API |
| `npm run dev:web` | Solo el frontend |
| `npm run build` | Build de producción del frontend |
| `npm run start` | Inicia la API en modo producción |
| `npm run db:migrate` | Corre las migraciones de Drizzle |
| `npm run db:seed` | Inserta datos iniciales |
| `npm run db:studio` | Abre Drizzle Studio (UI para la base de datos) |

## API

La API corre en el puerto `3001`. En producción, también sirve el frontend estático.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/teams` | Listar equipos |
| GET | `/api/teams/:id` | Detalle de equipo |
| GET | `/api/quarters` | Trimestres disponibles |
| GET | `/api/members` | Listar miembros |
| GET | `/api/objectives` | Listar objetivos (filtros: `team`, `quarter`, `year`) |
| POST | `/api/objectives` | Crear objetivo |
| PATCH | `/api/objectives/:id` | Actualizar objetivo |
| DELETE | `/api/objectives/:id` | Eliminar objetivo |
| GET | `/api/objectives/:id/comments` | Comentarios de un objetivo |
| POST | `/api/objectives/:id/comments` | Agregar comentario |
| GET | `/api/key-results` | Listar Key Results |
| POST | `/api/key-results` | Crear Key Result |
| PATCH | `/api/key-results/:id` | Actualizar Key Result |
| DELETE | `/api/key-results/:id` | Eliminar Key Result |
| GET | `/api/check-ins` | Listar check-ins |
| POST | `/api/check-ins` | Registrar check-in (actualiza `current_value` del KR) |

## Modelo de datos

```
members          → equipo (infra / cs / all)
teams            → infra, cs
objectives       ← team, quarter, year, status, owner
  key_results    ← objective, target, currentValue, baselineValue, status
    check_ins    ← keyResult, date, value, note
objective_comments ← objective, author, body
```

### Estados

**Objetivo:** `active` · `achieved` · `at-risk` · `missed`

**Key Result:** `on-track` · `at-risk` · `achieved` · `missed` · `not-started`

### KRs "lower is better"

Si un KR tiene `baseline_value` definido, el progreso se calcula desde ese valor base hacia el target (soporte para métricas donde reducir es mejorar, ej: tiempo de respuesta, errores).

## Deploy (Railway)

El deploy corre automáticamente desde `main`:

1. Build: `npm install && npm run build -w apps/web`
2. Start: `NODE_ENV=production node apps/api/src/index.js`

En producción, la API sirve el frontend desde `apps/web/dist` y ejecuta las migraciones de Drizzle al arrancar.

Variable de entorno requerida en Railway:

```
DATABASE_URL=postgresql://...
```
