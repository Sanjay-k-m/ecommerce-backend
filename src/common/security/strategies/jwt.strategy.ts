import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { jwtConfig } from 'src/config';

interface JwtPayload {
  sub: number;
  email: string;
  roles?: string[];
}

export interface JwtUser {
  userId: number;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const {
      accessToken: { secret, ignoreExpiration },
    } = jwtConfig();

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration,
    };
    super(options);
  }

  validate(payload: JwtPayload): JwtUser {
    console.log('Payload:', payload);
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}
