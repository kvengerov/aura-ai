import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { TABLES, COLUMNS, ERROR_MESSAGES, BOOKING_STATUS } from '../config/constants';

@Injectable()
export class BookingsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .select(`*, ${TABLES.CLIENTS}(${COLUMNS.NAME}, ${COLUMNS.PHONE}, ${COLUMNS.EMAIL}), ${TABLES.SERVICES}(${COLUMNS.NAME}, ${COLUMNS.PRICE}, ${COLUMNS.DURATION_MIN}), ${TABLES.STAFF}(${COLUMNS.USER_ID}, ${COLUMNS.ROLE})`)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .order(COLUMNS.DATE_TIME, { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .select(`*, ${TABLES.CLIENTS}(*), ${TABLES.SERVICES}(*), ${TABLES.STAFF}(*)`)
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .single();
    
    if (error) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND.BOOKING);
    return data;
  }

  async findCalendar(organizationId: string, startDate: string, endDate: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .select(`*, ${TABLES.CLIENTS}(${COLUMNS.NAME}, ${COLUMNS.PHONE}), ${TABLES.SERVICES}(${COLUMNS.NAME}, color), ${TABLES.STAFF}(${COLUMNS.ROLE})`)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .gte(COLUMNS.DATE_TIME, startDate)
      .lte(COLUMNS.DATE_TIME, endDate)
      .order(COLUMNS.DATE_TIME);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async create(organizationId: string, dto: CreateBookingDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .insert({ 
        ...dto, 
        [COLUMNS.ORGANIZATION_ID]: organizationId,
        [COLUMNS.DATE_TIME]: dto.dateTime,
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateBookingDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .update(dto)
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async confirm(id: string, organizationId: string) {
    return this.update(id, organizationId, { [COLUMNS.STATUS]: BOOKING_STATUS.CONFIRMED });
  }

  async complete(id: string, organizationId: string) {
    return this.update(id, organizationId, { [COLUMNS.STATUS]: BOOKING_STATUS.COMPLETED });
  }

  async cancel(id: string, organizationId: string) {
    return this.update(id, organizationId, { [COLUMNS.STATUS]: BOOKING_STATUS.CANCELLED });
  }

  async remove(id: string, organizationId: string) {
    const { error } = await this.supabase.client
      .from(TABLES.BOOKINGS)
      .delete()
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
