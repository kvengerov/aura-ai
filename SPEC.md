# Aura AI - SaaS платформа управления бизнесом услуг

## Архитектура

- **Backend:** NestJS + Supabase (PostgreSQL)
- **Frontend Web:** Next.js 16.2.1
- **Мобильное:** Flutter
- **Monorepo:** Nx 18+
- **AI:** OpenAI API (GPT-4o)
- **Email:** SendGrid
- **Календарь:** Google Calendar API

## Стек

| Компонент | Версия |
|-----------|--------|
| @nestjs/cli | 11.0.16 |
| @nestjs/core | 11.x |
| Nx | 18+ |
| Next.js | 16.2.1 |

## Структура Nx Workspace

```
apps/
├── api/     # NestJS (порт 4000)
└── web/     # Next.js (порт 3000)

packages/
├── shared/       # Общие типы
└── api-client/   # API клиент

libs/
├── ui/           # UI компоненты
└── data-access/  # Доступ к данным
```

## API Endpoints

- `/api/v1/auth` - Аутентификация
- `/api/v1/clients` - Клиенты (CRM)
- `/api/v1/services` - Услуги
- `/api/v1/staff` - Персонал
- `/api/v1/bookings` - Записи
- `/api/v1/ai` - AI чат
- `/api/v1/campaigns` - Email рассылки

## Стоимость (месяц)

| Сервис | Стоимость |
|--------|-----------|
| Supabase | $0-25 |
| Vercel | $0-20 |
| OpenAI | $10-50 |
| SendGrid | $15 |
| **Итого** | **$25-110** |
