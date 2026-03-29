import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(private supabase: SupabaseService) {}

  async findAll(organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('staff')
      .select('*, users(name, email, phone, avatar_url)')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, organizationId: string) {
    const { data, error } = await this.supabase.client
      .from('staff')
      .select('*, users(name, email, phone, avatar_url)')
      .eq('id', id)
      .eq('organization_id', organizationId)
      .single();
    
    if (error) throw new NotFoundException('Staff not found');
    return data;
  }

  async create(organizationId: string, dto: CreateStaffDto) {
    const { data, error } = await this.supabase.client
      .from('staff')
      .insert({ ...dto, organization_id: organizationId })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, organizationId: string, dto: UpdateStaffDto) {
    const { data, error } = await this.supabase.client
      .from('staff')
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
      .from('staff')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw new Error(error.message);
    return { success: true };
  }
}
