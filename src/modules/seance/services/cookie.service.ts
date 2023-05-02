import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { TSchema, TSameSite } from '@common/types';
import { converterFromExp } from '@common/utils';
import { TOKEN_NAMES } from '@common/consts';

import { Seance } from '@modules/seance/models';

@Injectable()
export class CookieService {
  constructor(
    private readonly configService: ConfigService<TSchema>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Seance)
    private readonly seanceModel: typeof Seance,
  ) {}

  public add(res: Response, { access, refresh }): void {
    res.cookie(TOKEN_NAMES.ACCESS, access, this.accessOptions);
    res.cookie(TOKEN_NAMES.REFRESH, refresh, this.refreshOptions);
    res.cookie(TOKEN_NAMES.AUTH, true, this.authOptions);
    res.send();
  }

  public remove(res: Response): void {
    res.clearCookie(TOKEN_NAMES.ACCESS, {
      ...this.accessOptions,
      maxAge: 0,
    });
    res.clearCookie(TOKEN_NAMES.REFRESH, {
      ...this.refreshOptions,
      maxAge: 0,
    });
    res.clearCookie(TOKEN_NAMES.AUTH, {
      ...this.authOptions,
      maxAge: 0,
    });
    res.send();
  }

  public clear(res: Response, name: string, options: CookieOptions): Response {
    return res.clearCookie(name, options);
  }

  public get refreshOptions(): CookieOptions {
    const maxAge = this.refreshMaxAge;
    const httpOnly = this.httpOnly;
    const base = this.base;
    const path = this.path;

    return {
      ...base,
      httpOnly,
      maxAge,
      path,
    };
  }

  public get accessOptions(): CookieOptions {
    const maxAge = this.accessMaxAge;
    const base = this.base;

    return {
      ...base,
      maxAge,
    };
  }

  public get authOptions(): CookieOptions {
    const maxAge = this.refreshMaxAge;
    const base = this.base;

    return {
      ...base,
      maxAge,
    };
  }

  private get base(): CookieOptions {
    const sameSite = this.sameSite;
    const domain = this.domain;
    const secure = this.secure;

    return {
      sameSite,
      domain,
      secure,
    };
  }

  private get accessMaxAge(): number {
    return converterFromExp(this.accessExpiration, 'ms');
  }

  private get refreshMaxAge(): number {
    return converterFromExp(this.refreshExpiration, 'ms');
  }

  private get accessExpiration(): string {
    return this.configService.get('***');
  }

  private get refreshExpiration(): string {
    return this.configService.get('***');
  }

  private get httpOnly(): boolean {
    return this.configService.get('***');
  }

  private get secure(): boolean {
    return this.configService.get('***');
  }

  private get sameSite(): TSameSite {
    return this.configService.get('***');
  }

  private get domain(): string {
    return this.configService.get('***');
  }

  private get path(): string {
    return this.configService.get('***');
  }
}
