import { API_URL } from './supabase';

const getHeaders = (organizationId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (organizationId) {
    headers['x-organization-id'] = organizationId;
  }
  return headers;
};

export const authApi = {
  register: async (data: { email: string; password: string; organizationName: string; name?: string }) => {
    const res = await fetch(`${API_URL}/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
};

export const clientsApi = {
  getAll: async (organizationId: string) => {
    const res = await fetch(`${API_URL}/v1/clients`, {
      headers: getHeaders(organizationId),
    });
    return res.json();
  },

  create: async (organizationId: string, data: any) => {
    const res = await fetch(`${API_URL}/v1/clients`, {
      method: 'POST',
      headers: getHeaders(organizationId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (organizationId: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/v1/clients/${id}`, {
      method: 'PATCH',
      headers: getHeaders(organizationId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (organizationId: string, id: string) => {
    const res = await fetch(`${API_URL}/v1/clients/${id}`, {
      method: 'DELETE',
      headers: getHeaders(organizationId),
    });
    return res.json();
  },
};

export const servicesApi = {
  getAll: async (organizationId: string) => {
    const res = await fetch(`${API_URL}/v1/services`, {
      headers: getHeaders(organizationId),
    });
    return res.json();
  },
};

export const bookingsApi = {
  getAll: async (organizationId: string) => {
    const res = await fetch(`${API_URL}/v1/bookings`, {
      headers: getHeaders(organizationId),
    });
    return res.json();
  },

  getCalendar: async (organizationId: string, start: string, end: string) => {
    const res = await fetch(`${API_URL}/v1/bookings/calendar?start=${start}&end=${end}`, {
      headers: getHeaders(organizationId),
    });
    return res.json();
  },

  create: async (organizationId: string, data: any) => {
    const res = await fetch(`${API_URL}/v1/bookings`, {
      method: 'POST',
      headers: getHeaders(organizationId),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
