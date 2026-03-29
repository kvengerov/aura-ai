# Aura AI - SaaS Platform for Service Business Management

## Architecture

- **Backend:** NestJS + Supabase (PostgreSQL)
- **Frontend Web:** Next.js + React
- **Mobile:** Flutter
- **Monorepo:** Nx
- **AI:** OpenAI API (GPT-4o)
- **Email:** SendGrid
- **Calendar:** Google Calendar API

## Tech Stack

| Component | Version |
|-----------|---------|
| NestJS | 11.1.17 |
| Nx | 22.6.3  |
| Next.js | 16.2.1  |
| React | 19.2.4  |
| TypeScript | 5.9.3   |

## Nx Workspace Structure

```
apps/
├── api/     # NestJS (port 4000)
└── web/     # Next.js (port 3000)

packages/
├── shared/       # Shared types
└── api-client/  # API client

libs/
├── ui/            # UI components
└── data-access/  # Data access
```

## API Endpoints

- `/api/v1/auth` - Authentication
- `/api/v1/clients` - Clients (CRM)
- `/api/v1/services` - Services
- `/api/v1/staff` - Staff
- `/api/v1/bookings` - Bookings
- `/api/v1/ai` - AI chat
- `/api/v1/campaigns` - Email campaigns

## Monthly Cost

| Service | Cost |
|---------|------|
| Supabase | $0-25 |
| Vercel | $0-20 |
| OpenAI | $10-50 |
| SendGrid | $15 |
| **Total** | **$25-110** |
