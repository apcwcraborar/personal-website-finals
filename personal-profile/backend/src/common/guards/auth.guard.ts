import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authHeader.substring(7).trim();

    try {
      const payload = this.tokenService.verifyToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException(message);
    }
  }
}
