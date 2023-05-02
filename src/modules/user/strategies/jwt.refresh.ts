import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import { cookieExtractor } from '@common/utils';

import { JWT_STRATEGIES_NAMES } from '@common/consts';

import { UserSessionPayload } from '@modules/user/dtos';

@Injectable()
export class JwtRefresh extends PassportStrategy(
  Strategy,
  JWT_STRATEGIES_NAMES.REFRESH,
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('***'),
    });
  }

  async validate(user: UserSessionPayload) {
    return user;
  }
}
