import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { TABLES, COLUMNS, ERROR_MESSAGES } from '../config/constants';

@Injectable()
export class ServicesService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.SERVICES)
      .select('*')
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .order(COLUMNS.NAME);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.SERVICES)
      .select('*')
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .single();
    
    if (error) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND.SERVICE);
    return data;
  }

  async create(organizationId: string, dto: CreateServiceDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.SERVICES)
      .insert({ ...dto, [COLUMNS.ORGANIZATION_ID]: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateServiceDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.SERVICES)
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
      .from(TABLES.SERVICES)
      .delete()
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
