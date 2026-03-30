import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';
import { TABLES, COLUMNS, ERROR_MESSAGES } from '../config/constants';

@Injectable()
export class ClientsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.CLIENTS)
      .select('*')
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .order(COLUMNS.CREATED_AT, { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from(TABLES.CLIENTS)
      .select('*')
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId)
      .single();
    
    if (error) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND.CLIENT);
    return data;
  }

  async create(organizationId: string, dto: CreateClientDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.CLIENTS)
      .insert({ ...dto, [COLUMNS.ORGANIZATION_ID]: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateClientDto) {
    const { data, error } = await this.supabase.client
      .from(TABLES.CLIENTS)
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
      .from(TABLES.CLIENTS)
      .delete()
      .eq(COLUMNS.ID, id)
      .eq(COLUMNS.ORGANIZATION_ID, organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
