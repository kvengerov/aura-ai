export const API_CONFIG = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  PREFIX: 'api',
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
} as const;

export const SUPABASE_CONFIG = {
  URL: process.env.SUPABASE_URL || '',
  KEY: process.env.SUPABASE_KEY || '',
} as const;

export const TABLES = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  CLIENTS: 'clients',
  SERVICES: 'services',
  STAFF: 'staff',
  BOOKINGS: 'bookings',
} as const;

export const COLUMNS = {
  ID: 'id',
  ORGANIZATION_ID: 'organization_id',
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  ROLE: 'role',
  PASSWORD_HASH: 'password_hash',
  AVATAR_URL: 'avatar_url',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  IS_ACTIVE: 'is_active',
  LAST_LOGIN: 'last_login',
  DATE_TIME: 'date_time',
  STATUS: 'status',
  PRICE: 'price',
  DURATION_MIN: 'duration_min',
  CATEGORY: 'category',
  DESCRIPTION: 'description',
  NOTES: 'notes',
  TOTAL_VISITS: 'total_visits',
  USER_ID: 'user_id',
  SERVICE_ID: 'service_id',
  CLIENT_ID: 'client_id',
  STAFF_ID: 'staff_id',
  SLUG: 'slug',
  LOGO_URL: 'logo_url',
  SETTINGS: 'settings',
  TIMEZONE: 'timezone',
} as const;

export const HEADERS = {
  ORGANIZATION_ID: 'x-organization-id',
  AUTHORIZATION: 'authorization',
} as const;

export const QUERY_PARAMS = {
  START: 'start',
  END: 'end',
} as const;

export const AUTH_ROUTES = {
  REGISTER: 'register',
  LOGIN: 'login',
  ME: 'me',
} as const;

export const TOKEN_PREFIX = 'demo-token-';

export const ERROR_MESSAGES = {
  NOT_FOUND: {
    CLIENT: 'Client not found',
    SERVICE: 'Service not found',
    STAFF: 'Staff not found',
    BOOKING: 'Booking not found',
    USER: 'User not found',
    ORGANIZATION: 'Organization not found',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    ORGANIZATION_EXISTS: 'Organization already exists',
  },
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;
