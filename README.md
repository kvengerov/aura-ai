# Aura AI

SaaS платформа для управления бизнесом в сфере услуг (фитнес-клубы, салоны, офисы).

## Технологии

- **Backend:** NestJS + Supabase (PostgreSQL)
- **Frontend:** Next.js 16
- **Mobile:** Flutter
- **AI:** OpenAI API (GPT-4o)
- **Monorepo:** Nx 18+
- **Docker:** docker-compose

## Структура проекта

```
apps/
├── api/     # NestJS API (порт 4000)
└── web/     # Next.js Web (порт 3000)

packages/   # Общие пакеты
libs/       # Доменные библиотеки
docs/       # Документация
```

## Быстрый старт

### Установка

```bash
npm install
```

### Локальная разработка

```bash
# Запустить всё (API + Web)
npm run dev

# Только API
npm run dev:api

# Только Web
npm run dev:web
```

### Docker

```bash
# Сборка и запуск
npm run docker:dev

# Только запуск
npm run docker:up

# Остановка
npm run docker:down
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

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

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev серверов |
| `npm run build` | Сборка проекта |
| `npm run docker:dev` | Запуск в Docker |

## Лицензия

MIT
