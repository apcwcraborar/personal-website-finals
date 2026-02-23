import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface TokenPayload {
  username: string;
}

@Injectable()
export class TokenService {
  private readonly secret: string;
  private readonly maxAge: number;

  constructor() {
    this.secret = process.env.FLASK_SECRET_KEY || 'dev-secret-change-me';
    this.maxAge = parseInt(process.env.TOKEN_MAX_AGE_SECONDS || '86400', 10);
  }

  generateToken(username: string): string {
    const payload: TokenPayload = { username };
    return jwt.sign(payload, this.secret, { expiresIn: this.maxAge });
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }
}
