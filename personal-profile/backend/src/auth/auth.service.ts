import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../common/services/token.service';

@Injectable()
export class AuthService {
  constructor(private tokenService: TokenService) {}

  login(username: string, password: string) {
    const appUsername = process.env.APP_LOGIN_USERNAME || 'admin';
    const appPassword = process.env.APP_LOGIN_PASSWORD || 'password123';
    const afterLoginUrl = process.env.AFTER_LOGIN_URL || '/main.html';

    if (username !== appUsername || password !== appPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.tokenService.generateToken(username);
    return {
      token,
      redirectUrl: afterLoginUrl,
    };
  }
}
