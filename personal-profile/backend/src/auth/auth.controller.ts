import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() payload: { username: string; password: string }) {
    return this.authService.login(payload.username, payload.password);
  }
}
