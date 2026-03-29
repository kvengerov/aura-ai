import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('services')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw new NotFoundException('Service not found');
    return data;
  }

  async create(organizationId: string, dto: CreateServiceDto) {
    const { data, error } = await this.supabase.client
      .from('services')
      .insert({ ...dto, organization_id: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateServiceDto) {
    const { data, error } = await this.supabase.client
      .from('services')
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
      .from('services')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
