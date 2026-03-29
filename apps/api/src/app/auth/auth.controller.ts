import { Controller, Post, Get, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private supabase: SupabaseService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader) throw new UnauthorizedException('No token');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await this.supabase.client.auth.getUser(token);
    
    if (!user) throw new UnauthorizedException('Invalid token');
    
    return this.authService.getProfile(user.id);
  }
}
