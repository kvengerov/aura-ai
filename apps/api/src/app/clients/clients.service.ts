import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateClientDto, UpdateClientDto } from './dto/client.dto';

@Injectable()
export class ClientsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('clients')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw new NotFoundException('Client not found');
    return data;
  }

  async create(organizationId: string, dto: CreateClientDto) {
    const { data, error } = await this.supabase.client
      .from('clients')
      .insert({ ...dto, organization_id: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateClientDto) {
    const { data, error } = await this.supabase.client
      .from('clients')
      .update(dto)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string, organizationId: string) {
    const { error } = await this.supabase.client
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
