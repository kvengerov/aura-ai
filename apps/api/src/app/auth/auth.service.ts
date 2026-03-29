import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterDto) {
    const slug = dto.organizationSlug || dto.organizationName.toLowerCase().replace(/\s+/g, '-');

    // Create organization
    const { data: org, error: orgError } = await this.supabase.client
      .from('organizations')
      .insert({ name: dto.organizationName, slug })
      .select()
      .single();

    if (orgError) throw new ConflictException('Organization already exists');

    // Create auth user
    const { data: authData, error: authError } = await this.supabase.client.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (authError) throw new ConflictException(authError.message);

    // Create user in users table
    const { data: user, error: userError } = await this.supabase.client
      .from('users')
      .insert({
        id: authData.user?.id,
        organization_id: org.id,
        email: dto.email,
        password_hash: this.hashPassword(dto.password),
        role: 'owner',
        name: dto.name || dto.email.split('@')[0],
      })
      .select()
      .single();

    if (userError) throw new ConflictException(userError.message);

    return { user, organization: org };
  }

  async login(dto: LoginDto) {
    const { data: authData, error: authError } = await this.supabase.client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (authError) throw new UnauthorizedException('Invalid credentials');

    const { data: user } = await this.supabase.client
      .from('users')
      .select('*, organizations(*)')
      .eq('id', authData.user?.id)
      .single();

    return { user, session: authData.session };
  }

  async getProfile(userId: string) {
    const { data: user } = await this.supabase.client
      .from('users')
      .select('*, organizations(*)')
      .eq('id', userId)
      .single();

    return user;
  }
}
