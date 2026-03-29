import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { createHash } from 'crypto';
import { randomUUID } from 'crypto';

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

    // Create user directly in DB (bypass Supabase Auth for testing)
    const userId = randomUUID();
    
    const { data: user, error: userError } = await this.supabase.client
      .from('users')
      .insert({
        id: userId,
        organization_id: org.id,
        email: dto.email,
        password_hash: this.hashPassword(dto.password),
        role: 'owner',
        name: dto.name || dto.email.split('@')[0],
      })
      .select()
      .single();

    if (userError) {
      // Rollback organization
      await this.supabase.client.from('organizations').delete().eq('id', org.id);
      throw new ConflictException(userError.message);
    }

    return { user, organization: org };
  }

  async login(dto: LoginDto) {
    const { data: users, error: userError } = await this.supabase.client
      .from('users')
      .select('*, organizations(*)')
      .eq('email', dto.email)
      .limit(1);

    if (userError || !users || users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];
    const hashedPassword = this.hashPassword(dto.password);
    
    if (user.password_hash !== hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { 
      user, 
      session: { 
        access_token: 'demo-token-' + user.id,
        user 
      } 
    };
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
