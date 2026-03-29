# Aura AI

SaaS platform for business management in the service industry (fitness clubs, salons, offices).

## Technologies

- **Backend:** NestJS + Supabase (PostgreSQL)
- **Frontend:** Next.js + React
- **Mobile:** Flutter
- **AI:** OpenAI API (GPT-4o)
- **Monorepo:** Nx
- **Docker:** docker-compose

## Project Structure

```
apps/
├── api/     # NestJS API (port 4000)
└── web/     # Next.js Web (port 3000)

packages/   # Shared packages
libs/       # Domain libraries
docs/       # Documentation
```

## Quick Start

### Installation

```bash
npm install
```

### Local Development

```bash
# Run everything (API + Web)
npm run dev

# API only
npm run dev:api

# Web only
npm run dev:web
```

### Docker

```bash
# Build and run
npm run docker:dev

# Run only
npm run docker:up

# Stop
npm run docker:down
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/aura
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG....
```

## Ports

- **API:** http://localhost:4000
- **Web:** http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run dev servers |
| `npm run build` | Build project |
| `npm run docker:dev` | Run in Docker |

## License

MIT
