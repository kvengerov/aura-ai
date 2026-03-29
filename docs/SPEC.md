# Aura AI - Техническая спецификация

## 1. Техническая архитектура

### Стек технологий

| Компонент | Технология |
|-----------|------------|
| Backend API | NestJS |
| База данных | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Frontend Web | Next.js 16.2.1 |
| Мобильное | Flutter |
| Monorepo | Nx 18+ |
| AI | OpenAI API (GPT-4o) |
| Email | SendGrid API |
| Календарь | Google Calendar API |

### Версии

| Пакет | Версия |
|-------|--------|
| @nestjs/cli | 11.0.16 |
| @nestjs/core | 11.x |
| @nestjs/common | 11.x |
| Nx | 18+ |
| Next.js | 16.2.1 |

### Стоимость (месяц)

| Сервис | Стоимость |
|--------|-----------|
| Supabase | $0-25 |
| Vercel | $0-20 |
| OpenAI | $10-50 |
| SendGrid | $15 |
| **Итого** | **$25-110** |

---

## 2. Структура базы данных

### Таблицы

#### organizations
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            VARCHAR(255) NOT NULL
slug            VARCHAR(100) UNIQUE NOT NULL
logo_url        TEXT
settings        JSONB DEFAULT '{}'
timezone        VARCHAR(50) DEFAULT 'UTC'
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### users
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255)
role            ENUM('owner', 'admin', 'manager', 'staff', 'client')
name            VARCHAR(255)
phone           VARCHAR(50)
avatar_url      TEXT
last_login      TIMESTAMPTZ
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### clients
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
user_id         UUID REFERENCES users(id)
name            VARCHAR(255) NOT NULL
email           VARCHAR(255)
phone           VARCHAR(50) NOT NULL
birth_date      DATE
notes           TEXT
tags            TEXT[]
total_visits    INT DEFAULT 0
total_spent     DECIMAL(12,2) DEFAULT 0
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### services
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
name            VARCHAR(255) NOT NULL
description     TEXT
category        VARCHAR(100)
price           DECIMAL(10,2)
duration_min    INT NOT NULL
color           VARCHAR(7)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### staff
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
user_id         UUID REFERENCES users(id)
role            VARCHAR(100)
specialties     TEXT[]
bio             TEXT
schedule        JSONB
commission_pct  DECIMAL(5,2)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### bookings
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
client_id       UUID REFERENCES clients(id)
service_id      UUID REFERENCES services(id)
staff_id        UUID REFERENCES staff(id)
date_time       TIMESTAMPTZ NOT NULL
duration_min    INT
status          ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show')
source          ENUM('app', 'website', 'phone', 'chat_ai')
notes           TEXT
price_paid      DECIMAL(10,2)
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

#### ai_conversations
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
user_id         UUID REFERENCES users(id)
client_id       UUID REFERENCES clients(id)
messages        JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### email_campaigns
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
name            VARCHAR(255)
subject         VARCHAR(500)
content         TEXT
status          ENUM('draft', 'scheduled', 'sent')
scheduled_at    TIMESTAMPTZ
sent_at         TIMESTAMPTZ
recipients      JSONB
stats           JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
```

#### documents
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
organization_id UUID REFERENCES organizations(id)
client_id       UUID REFERENCES clients(id)
type            ENUM('contract', 'invoice', 'act', 'other')
number          VARCHAR(100)
file_url        TEXT
content         JSONB
status          ENUM('draft', 'signed', 'cancelled')
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### RLS (Row Level Security)

```sql
CREATE POLICY "Organization isolation" ON clients
  USING (organization_id = (
    SELECT organization_id FROM users 
    WHERE id = auth.uid()
  ));
```

---

## 3. Спецификация API

### API Structure

```
/api/v1
├── /auth
├── /organizations
├── /users
├── /clients
├── /services
├── /staff
├── /bookings
├── /documents
├── /ai
└── /campaigns
```

### Auth Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/auth/register` | Регистрация организации |
| POST | `/auth/login` | Вход |
| POST | `/auth/oauth/google` | Google OAuth |
| POST | `/auth/logout` | Выход |
| GET | `/auth/me` | Текущий пользователь |

### Clients Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/clients` | Список (пагинация, фильтры) |
| GET | `/clients/:id` | Детали |
| POST | `/clients` | Создать |
| PATCH | `/clients/:id` | Обновить |
| DELETE | `/clients/:id` | Удалить |
| GET | `/clients/:id/history` | История посещений |

### Services Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/services` | Список услуг |
| GET | `/services/:id` | Детали услуги |
| POST | `/services` | Создать услугу |
| PATCH | `/services/:id` | Обновить услугу |
| DELETE | `/services/:id` | Удалить услугу |

### Staff Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/staff` | Список персонала |
| GET | `/staff/:id` | Профиль сотрудника |
| POST | `/staff` | Добавить сотрудника |
| PATCH | `/staff/:id` | Обновить сотрудника |
| GET | `/staff/:id/schedule` | График работы |

### Bookings Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/bookings` | Список |
| GET | `/bookings/calendar` | Календарь |
| GET | `/bookings/:id` | Детали |
| POST | `/bookings` | Создать |
| PATCH | `/bookings/:id` | Обновить |
| DELETE | `/bookings/:id` | Отменить |
| POST | `/bookings/:id/confirm` | Подтвердить |
| POST | `/bookings/:id/complete` | Завершить |

### AI Chat Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/ai/chat` | Чат (SSE streaming) |
| GET | `/ai/conversations` | История чатов |
| GET | `/ai/conversations/:id` | Конкретный чат |

### Campaigns Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/campaigns` | Список рассылок |
| POST | `/campaigns` | Создать рассылку |
| POST | `/campaigns/:id/send` | Отправить |
| GET | `/campaigns/:id/stats` | Статистика |

---

## 4. AI Chat Architecture

### Поток

```
Пользователь → API → Извлечение интента → Выполнение действия → GPT ответ → SSE
```

### Интенты

- `create_booking` - создать запись
- `get_schedule` - показать расписание
- `get_client_info` - информация о клиенте
- `general_question` - общие вопросы

### Системный промпт

```
Ты - AI-ассистент для управления услугами (фитнес, салоны, офисы).
Ты можешь:
- Записывать клиентов на услуги
- Показывать расписание
- Информировать о клиентах
- Отвечать на вопросы об организации

Всегда будь вежлив и точен.
```

---

## 5. Структура Nx проекта

```
aura-ai/
├── apps/
│   ├── api/          # NestJS
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/
│   │   │   ├── clients/
│   │   │   ├── services/
│   │   │   ├── staff/
│   │   │   ├── bookings/
│   │   │   ├── ai/
│   │   │   └── campaigns/
│   │   └── project.json
│   │
│   └── web/          # Next.js
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   └── lib/
│       └── project.json
│
├── packages/
│   ├── shared/       # Типы, константы
│   └── api-client/  # API клиент
│
├── libs/
│   ├── ui/           # UI компоненты
│   └── data-access/  # Доступ к данным
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## 6. Зависимости

### API (NestJS)

```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0",
  "@nestjs/cli": "11.0.16",
  "@nestjs/platform-express": "^11.0.0",
  "@nestjs/config": "^3.0.0",
  "@nestjs/swagger": "^7.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "openai": "^4.0.0",
  "@sendgrid/mail": "^8.0.0",
  "googleapis": "^130.0.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.0"
}
```

### Web (Next.js)

```json
{
  "next": "16.2.1",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "zod": "^3.0.0"
}
```

---

## 7. План разработки

### Этап 1 (MVP - 2-3 месяца)

1. Инициализация Nx workspace
2. Настройка Supabase (БД, Auth, RLS)
3. API: Auth, Clients, Services, Staff, Bookings
4. Web: Логин, Дашборд, Клиенты, Календарь
5. AI чат (базовый)

### Этап 2

1. Flutter мобильное приложение
2. Email рассылки (SendGrid)
3. Google Calendar синхронизация
4. Документооборот
