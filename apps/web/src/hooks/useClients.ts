import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  total_visits?: number;
  organization_id: string;
  created_at: string;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: (organizationId: string) => Promise<void>;
  createClient: (organizationId: string, data: Partial<Client>) => Promise<Client>;
  updateClient: (organizationId: string, id: string, data: Partial<Client>) => Promise<Client>;
  deleteClient: (organizationId: string, id: string) => Promise<void>;
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async (organizationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Client[]>('/v1/clients', { organizationId });
      setClients(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch clients';
      setError(message);
      logger.error('fetchClients', { error: message, organizationId });
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (organizationId: string, data: Partial<Client>) => {
    const client = await api.post<Client>('/v1/clients', data, { organizationId });
    setClients((prev) => [client, ...prev]);
    logger.info('Client created', { clientId: client.id, organizationId });
    return client;
  }, []);

  const updateClient = useCallback(async (organizationId: string, id: string, data: Partial<Client>) => {
    const client = await api.patch<Client>(`/v1/clients/${id}`, data, { organizationId });
    setClients((prev) => prev.map((c) => (c.id === id ? client : c)));
    logger.info('Client updated', { clientId: id, organizationId });
    return client;
  }, []);

  const deleteClient = useCallback(async (organizationId: string, id: string) => {
    await api.delete(`/v1/clients/${id}`, { organizationId });
    setClients((prev) => prev.filter((c) => c.id !== id));
    logger.info('Client deleted', { clientId: id, organizationId });
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
