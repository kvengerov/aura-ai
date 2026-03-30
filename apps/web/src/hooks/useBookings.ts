import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';

export interface Booking {
  id: string;
  client_id: string;
  service_id: string;
  staff_id: string;
  date_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  organization_id: string;
  clients?: { name: string; phone: string; email: string };
  services?: { name: string; price: number; duration_min: number };
  staff?: { user_id: string; role: string };
  created_at: string;
}

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: (organizationId: string) => Promise<void>;
  fetchCalendar: (organizationId: string, start: string, end: string) => Promise<void>;
  createBooking: (organizationId: string, data: Partial<Booking>) => Promise<Booking>;
  updateBooking: (organizationId: string, id: string, data: Partial<Booking>) => Promise<Booking>;
  confirmBooking: (organizationId: string, id: string) => Promise<Booking>;
  completeBooking: (organizationId: string, id: string) => Promise<Booking>;
  cancelBooking: (organizationId: string, id: string) => Promise<Booking>;
  deleteBooking: (organizationId: string, id: string) => Promise<void>;
}

export function useBookings(): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (organizationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Booking[]>('/v1/bookings', { organizationId });
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      logger.error('fetchBookings', { error: message, organizationId });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendar = useCallback(async (organizationId: string, start: string, end: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Booking[]>(`/v1/bookings/calendar?start=${start}&end=${end}`, { organizationId });
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch calendar';
      setError(message);
      logger.error('fetchCalendar', { error: message, organizationId });
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (organizationId: string, data: Partial<Booking>) => {
    const booking = await api.post<Booking>('/v1/bookings', data, { organizationId });
    setBookings((prev) => [booking, ...prev]);
    logger.info('Booking created', { bookingId: booking.id, organizationId });
    return booking;
  }, []);

  const updateBooking = useCallback(async (organizationId: string, id: string, data: Partial<Booking>) => {
    const booking = await api.patch<Booking>(`/v1/bookings/${id}`, data, { organizationId });
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
    logger.info('Booking updated', { bookingId: id, organizationId });
    return booking;
  }, []);

  const confirmBooking = useCallback(async (organizationId: string, id: string) => {
    const booking = await api.post<Booking>(`/v1/bookings/${id}/confirm`, {}, { organizationId });
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
    logger.info('Booking confirmed', { bookingId: id, organizationId });
    return booking;
  }, []);

  const completeBooking = useCallback(async (organizationId: string, id: string) => {
    const booking = await api.post<Booking>(`/v1/bookings/${id}/complete`, {}, { organizationId });
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
    logger.info('Booking completed', { bookingId: id, organizationId });
    return booking;
  }, []);

  const cancelBooking = useCallback(async (organizationId: string, id: string) => {
    const booking = await api.patch<Booking>(`/v1/bookings/${id}`, { status: 'cancelled' }, { organizationId });
    setBookings((prev) => prev.map((b) => (b.id === id ? booking : b)));
    logger.info('Booking cancelled', { bookingId: id, organizationId });
    return booking;
  }, []);

  const deleteBooking = useCallback(async (organizationId: string, id: string) => {
    await api.delete(`/v1/bookings/${id}`, { organizationId });
    setBookings((prev) => prev.filter((b) => b.id !== id));
    logger.info('Booking deleted', { bookingId: id, organizationId });
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    fetchCalendar,
    createBooking,
    updateBooking,
    confirmBooking,
    completeBooking,
    cancelBooking,
    deleteBooking,
  };
}
