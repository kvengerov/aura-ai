import { useCallback } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
  organizations: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LoginResponse {
  user: AuthUser;
  session: {
    access_token: string;
    user: AuthUser;
  };
}

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<LoginResponse['user']>;
  register: (data: { email: string; password: string; organizationName: string; name?: string; organizationSlug?: string }) => Promise<{ user: AuthUser; organization: unknown }>;
}

export function useAuthApi(): UseAuthReturn {
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/v1/auth/login', { email, password });
      logger.info('User logged in', { userId: response.user.id, email });
      return response.user;
    } catch (err) {
      logger.error('Login failed', { email, error: err instanceof Error ? err.message : 'Unknown error' });
      throw err;
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; organizationName: string; name?: string; organizationSlug?: string }) => {
    try {
      const response = await api.post<{ user: AuthUser; organization: unknown }>('/v1/auth/register', data);
      logger.info('User registered', { userId: response.user.id, email: data.email, organizationName: data.organizationName });
      return response;
    } catch (err) {
      logger.error('Registration failed', { email: data.email, organizationName: data.organizationName, error: err instanceof Error ? err.message : 'Unknown error' });
      throw err;
    }
  }, []);

  return { login, register };
}
