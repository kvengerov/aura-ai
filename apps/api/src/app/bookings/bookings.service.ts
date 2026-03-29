import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*, clients(name, phone, email), services(name, price, duration_min), staff(user_id, role)')
      .eq('organization_id', organizationId)
      .order('date_time', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*, clients(*), services(*), staff(*)')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw new NotFoundException('Booking not found');
    return data;
  }

  async findCalendar(organizationId: string, startDate: string, endDate: string) {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*, clients(name, phone), services(name, color), staff(role)')
      .eq('organization_id', organizationId)
      .gte('date_time', startDate)
      .lte('date_time', endDate)
      .order('date_time');
    
    if (error) throw new Error(error.message);
    return data;
  }

  async create(organizationId: string, dto: CreateBookingDto) {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .insert({ 
        ...dto, 
        organization_id: organizationId,
        date_time: dto.dateTime,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateBookingDto) {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .update(dto)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async confirm(id: string, organizationId: string) {
    return this.update(id, organizationId, { status: 'confirmed' });
  }

  async complete(id: string, organizationId: string) {
    return this.update(id, organizationId, { status: 'completed' });
  }

  async cancel(id: string, organizationId: string) {
    return this.update(id, organizationId, { status: 'cancelled' });
  }

  async remove(id: string, organizationId: string) {
    const { error } = await this.supabase.client
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
