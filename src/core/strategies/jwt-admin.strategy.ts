import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../../common/enums/role.enum';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedAdmin {
  id: string;
  email: string;
  type: UserType.ADMIN;
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.adminAccessToken || null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedAdmin> {
    return {
      id: payload.sub,
      email: payload.email,
      type: UserType.ADMIN,
    };
  }
}
