# Aura AI - SaaS Platform for Service Business Management

## Architecture

- **Backend:** NestJS + Supabase (PostgreSQL)
- **Frontend Web:** Next.js 16.2.1
- **Mobile:** Flutter
- **Monorepo:** Nx 22.x
- **AI:** OpenAI API (GPT-4o)
- **Email:** SendGrid
- **Calendar:** Google Calendar API

## Tech Stack

| Component | Version |
|-----------|---------|
| @nestjs/cli | 11.0.16 |
| @nestjs/core | 11.x |
| Nx | 22.x |
| Next.js | 16.2.1 |

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
