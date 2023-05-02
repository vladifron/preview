import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { JWT_STRATEGIES_NAMES } from '@common/consts';

import { SeanceService } from '@modules/seance/services';

@Injectable()
export class AccessGuard extends AuthGuard(JWT_STRATEGIES_NAMES.ACCESS) {
  constructor(private readonly seanceService: SeanceService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
    ])(request);

    if (!accessToken) this.seanceService.accessError;

    await this.seanceService.verifyAccess(accessToken);

    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err instanceof HttpException) {
      throw err;
    }
    return user;
  }
}
