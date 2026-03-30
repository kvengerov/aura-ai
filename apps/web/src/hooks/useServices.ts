import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration_min: number;
  category?: string;
  color?: string;
  is_active: boolean;
  organization_id: string;
  created_at: string;
}

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: (organizationId: string) => Promise<void>;
  createService: (organizationId: string, data: Partial<Service>) => Promise<Service>;
  updateService: (organizationId: string, id: string, data: Partial<Service>) => Promise<Service>;
  deleteService: (organizationId: string, id: string) => Promise<void>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (organizationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Service[]>('/v1/services', { organizationId });
      setServices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(message);
      logger.error('fetchServices', { error: message, organizationId });
    } finally {
      setLoading(false);
    }
  }, []);

  const createService = useCallback(async (organizationId: string, data: Partial<Service>) => {
    const service = await api.post<Service>('/v1/services', data, { organizationId });
    setServices((prev) => [...prev, service]);
    logger.info('Service created', { serviceId: service.id, organizationId });
    return service;
  }, []);

  const updateService = useCallback(async (organizationId: string, id: string, data: Partial<Service>) => {
    const service = await api.patch<Service>(`/v1/services/${id}`, data, { organizationId });
    setServices((prev) => prev.map((s) => (s.id === id ? service : s)));
    logger.info('Service updated', { serviceId: id, organizationId });
    return service;
  }, []);

  const deleteService = useCallback(async (organizationId: string, id: string) => {
    await api.delete(`/v1/services/${id}`, { organizationId });
    setServices((prev) => prev.filter((s) => s.id !== id));
    logger.info('Service deleted', { serviceId: id, organizationId });
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
}
