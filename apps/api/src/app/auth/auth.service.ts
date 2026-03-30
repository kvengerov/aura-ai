import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { createHash } from 'crypto';
import { randomUUID } from 'crypto';
import { TABLES, COLUMNS, ERROR_MESSAGES, ROLES, TOKEN_PREFIX } from '../config/constants';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterDto) {
    const slug = dto.organizationSlug || dto.organizationName.toLowerCase().replace(/\s+/g, '-');

    const { data: org, error: orgError } = await this.supabase.client
      .from(TABLES.ORGANIZATIONS)
      .insert({ [COLUMNS.NAME]: dto.organizationName, [COLUMNS.SLUG]: slug })
      .select()
      .single();

    if (orgError) throw new ConflictException(ERROR_MESSAGES.AUTH.ORGANIZATION_EXISTS);

    const userId = randomUUID();
    
    const { data: user, error: userError } = await this.supabase.client
      .from(TABLES.USERS)
      .insert({
        [COLUMNS.ID]: userId,
        [COLUMNS.ORGANIZATION_ID]: org[COLUMNS.ID],
        [COLUMNS.EMAIL]: dto.email,
        [COLUMNS.PASSWORD_HASH]: this.hashPassword(dto.password),
        [COLUMNS.ROLE]: ROLES.OWNER,
        [COLUMNS.NAME]: dto.name || dto.email.split('@')[0],
      })
      .select()
      .single();

    if (userError) {
      await this.supabase.client.from(TABLES.ORGANIZATIONS).delete().eq(COLUMNS.ID, org[COLUMNS.ID]);
      throw new ConflictException(userError.message);
    }

    return { user, organization: org };
  }

  async login(dto: LoginDto) {
    const { data: users, error: userError } = await this.supabase.client
      .from(TABLES.USERS)
      .select(`*, ${TABLES.ORGANIZATIONS}(*)`)
      .eq(COLUMNS.EMAIL, dto.email)
      .limit(1);

    if (userError || !users || users.length === 0) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const user = users[0];
    const hashedPassword = this.hashPassword(dto.password);
    
    if (user[COLUMNS.PASSWORD_HASH] !== hashedPassword) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return { 
      user, 
      session: { 
        access_token: TOKEN_PREFIX + user[COLUMNS.ID],
        user 
      } 
    };
  }

  async getProfile(userId: string) {
    const { data: user } = await this.supabase.client
      .from(TABLES.USERS)
      .select(`*, ${TABLES.ORGANIZATIONS}(*)`)
      .eq(COLUMNS.ID, userId)
      .single();

    return user;
  }
}
