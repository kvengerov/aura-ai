import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { TABLES, COLUMNS, ERROR_MESSAGES } from '../config/constants';

@Injectable()
export class StaffService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.STAFF)
      .select(`*, ${TABLES.USERS}(${COLUMNS.NAME}, ${COLUMNS.EMAIL}, ${COLUMNS.PHONE}, ${COLUMNS.AVATAR_URL})`)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .order(COLUMNS.CREATED_AT, { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.STAFF)
      .select(`*, ${TABLES.USERS}(${COLUMNS.NAME}, ${COLUMNS.EMAIL}, ${COLUMNS.PHONE}, ${COLUMNS.AVATAR_URL})`)
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .single();
    
    if (error) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND.STAFF);
    return data;
  }

  async create(organizationId: string, dto: CreateStaffDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.STAFF)
      .insert({ ...dto, [COLUMNS.ORGANIZATION_ID]: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateStaffDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.STAFF)
      .update(dto)
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, organizationId: string) {
    const { error } = await this.supabase.client
      .from(TABLES.STAFF)
      .delete()
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
