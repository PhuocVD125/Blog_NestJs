// src/auth/jwt.strategy.ts

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`);
    if (!payload.role) {
      this.logger.error('Payload does not contain role');
      throw new Error('Payload does not contain role');
    }
    return { userId: payload.id, email: payload.email, role: payload.role };
  }
}
