import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { JWT_STRATEGIES_NAMES, TOKEN_NAMES } from '@common/consts';

import { cookieExtractor } from '@common/utils';

import { CookieService, SeanceService } from '@modules/seance/services';
import { Response } from 'express';

@Injectable()
export class RefreshGuard extends AuthGuard(JWT_STRATEGIES_NAMES.REFRESH) {
  constructor(
    private readonly seanceService: SeanceService,
    private readonly cookieService: CookieService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = context.switchToHttp().getResponse();

    try {
      const request = context.switchToHttp().getRequest();

      const refreshToken = ExtractJwt.fromExtractors([cookieExtractor])(
        request,
      );

      if (!refreshToken) this.seanceService.refreshError;

      await this.seanceService.verifyRefresh(refreshToken);

      return this.activate(context);
    } catch {
      this.clearCookie(response);
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  private clearCookie(res: Response) {
    res.clearCookie(TOKEN_NAMES.ACCESS, {
      ...this.cookieService.accessOptions,
      maxAge: 0,
    });
    res.clearCookie(TOKEN_NAMES.REFRESH, {
      ...this.cookieService.refreshOptions,
      maxAge: 0,
    });
    res.clearCookie(TOKEN_NAMES.AUTH, {
      ...this.cookieService.authOptions,
      maxAge: 0,
    });

    throw this.seanceService.refreshError;
  }

  handleRequest(err, user) {
    if (err instanceof HttpException) {
      throw err;
    }
    return user;
  }
}
