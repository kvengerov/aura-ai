# Aura AI - Technical Specification

## 1. Technical Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Backend API | NestJS |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Frontend Web | Next.js 16.1.7 + React 19.2.4 |
| Mobile | Flutter |
| Monorepo | Nx 22.6.2 |
| AI | OpenAI API (GPT-4o) |
| Email | SendGrid API |
| Calendar | Google Calendar API |

### Versions

| Package | Version |
|---------|---------|
| NestJS | 11.1.17 |
| Nx | 22.6.3  |
| Next.js | 16.2.1  |
| React | 19.2.4  |
| TypeScript | 5.9.3   |

### Monthly Cost

| Service | Cost |
|---------|------|
| Supabase | $0-25 |
| Vercel | $0-20 |
| OpenAI | $10-50 |
| SendGrid | $15 |
| **Total** | **$25-110** |

---

## 2. Database Structure

### Tables

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

## 3. API Specification

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

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/auth/register` | Register organization |
| POST | `/auth/login` | Login |
| POST | `/auth/oauth/google` | Google OAuth |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |

### Clients Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/clients` | List (pagination, filters) |
| GET | `/clients/:id` | Details |
| POST | `/clients` | Create |
| PATCH | `/clients/:id` | Update |
| DELETE | `/clients/:id` | Delete |
| GET | `/clients/:id/history` | Visit history |

### Services Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/services` | List |
| GET | `/services/:id` | Details |
| POST | `/services` | Create |
| PATCH | `/services/:id` | Update |
| DELETE | `/services/:id` | Delete |

### Staff Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/staff` | List |
| GET | `/staff/:id` | Profile |
| POST | `/staff` | Add |
| PATCH | `/staff/:id` | Update |
| GET | `/staff/:id/schedule` | Work schedule |

### Bookings Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/bookings` | List |
| GET | `/bookings/calendar` | Calendar |
| GET | `/bookings/:id` | Details |
| POST | `/bookings` | Create |
| PATCH | `/bookings/:id` | Update |
| DELETE | `/bookings/:id` | Cancel |
| POST | `/bookings/:id/confirm` | Confirm |
| POST | `/bookings/:id/complete` | Complete |

### AI Chat Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/ai/chat` | Chat (SSE streaming) |
| GET | `/ai/conversations` | Chat history |
| GET | `/ai/conversations/:id` | Specific chat |

### Campaigns Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/campaigns` | List |
| POST | `/campaigns` | Create |
| POST | `/campaigns/:id/send` | Send |
| GET | `/campaigns/:id/stats` | Statistics |

---

## 4. AI Chat Architecture

### Flow

```
User -> API -> Intent Extraction -> Action Execution -> GPT Response -> SSE
```

### Intents

- `create_booking` - create booking
- `get_schedule` - show schedule
- `get_client_info` - client info
- `general_question` - general questions

### System Prompt

```
You are an AI assistant for service business management (fitness, salons, offices).
You can:
- Book clients for services
- Show schedule
- Provide client information
- Answer questions about the organization

Always be polite and accurate.
```

---

## 5. Nx Project Structure

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
│   ├── shared/       # Types, constants
│   └── api-client/  # API client
│
├── libs/
│   ├── ui/           # UI components
│   └── data-access/  # Data access
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## 6. Dependencies

### Root

```json
{
  "nx": "22.6.3",
  "typescript": "5.9.3"
}
```

### API (NestJS)

```json
{
  "@nestjs/common": "11.1.17",
  "@nestjs/core": "11.1.17",
  "reflect-metadata": "0.1.14",
  "rxjs": "7.8.1"
}
```

### Web (Next.js + React)

```json
{
  "next": "16.2.1",
  "react": "19.2.4",
  "react-dom": "19.2.4"
}
```

---

## 7. Development Plan

### Stage 1 (MVP - 2-3 months)

- [x] Initialize Nx workspace
- [x] Configure Supabase (DB, Auth, RLS)
- [x] API: Auth, Clients, Services, Staff, Bookings
- [ ] Web: Login, Dashboard, Clients, Calendar
- [ ] AI chat (basic)

### Stage 2

- [ ] Flutter mobile app
- [ ] Email campaigns (SendGrid)
- [ ] Google Calendar sync
- [ ] Document management
