import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { JWT_STRATEGIES_NAMES } from '@common/consts';

import { UserSessionPayload } from '@modules/user/dtos';

@Injectable()
export class JwtAccess extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES_NAMES.ACCESS,
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('***'),
    });
  }

  async validate(user: UserSessionPayload) {
    return user;
  }
}
