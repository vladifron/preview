import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FindOptions } from 'sequelize';
import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import {
  CACHE_MANAGER,
  HttpException,
  forwardRef,
  Injectable,
  Inject,
} from '@nestjs/common';

import { converterFromExp } from '@common/utils';
import { ErrorBase } from '@common/errors';

import { CookieService } from '@modules/seance/services/cookie.service';
import { RoleService } from '@modules/role/services';

import { Seance } from '@modules/seance/models';

import { UserSessionPayload, UserSuccessResponse } from '@modules/user/dtos';

import { FOIncludeUserById } from '@modules/seance/query';

import { TSchema } from '@common/types';

@Injectable()
export class SeanceService extends ErrorBase {
  constructor(
    private readonly configService: ConfigService<TSchema>,
    private readonly cookieService: CookieService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Seance)
    private readonly seance: typeof Seance,
  ) {
    super();
  }

  public async addToRedis<B>(key: string, value: B, ttl = this.ttl) {
    await this.cacheManager.set(key, value, { ttl });
  }

  public async create(res: Response, user: UserSuccessResponse): Promise<void> {
    const jti = uuidv4();
    const payload = await this.getPayloadByUser(user, jti);
    const refresh = await this.createRefresh(payload);
    const access = this.createAccess(payload);

    return this.cookieService.add(res, { access, refresh });
  }

  public async update(res: Response, user: UserSessionPayload): Promise<void> {
    await this.seance.destroy({ where: { id: user.jti } });
    await this.addBlackList(user.id, user.jti);

    return this.create(res, user);
  }

  public async remove(res: Response, user: UserSessionPayload): Promise<void> {
    await this.seance.destroy({ where: { id: user.jti } });
    await this.addBlackList(user.id, user.jti);

    return this.cookieService.remove(res);
  }

  public async verifyAccess(
    token: string,
  ): Promise<HttpException | UserSessionPayload> {
    try {
      const payload = this.getPayloadByToken(token, this.accessSecret);

      const blocked = await this.isBlocked(payload.id, payload.jti);

      if (blocked) this.accessError;

      return payload;
    } catch {
      throw this.accessError;
    }
  }

  public async verifyRefresh(
    token: string,
  ): Promise<HttpException | UserSessionPayload> {
    try {
      const payload = this.getPayloadByToken(token, this.refreshSecret);

      const { value } = await this.findByPayload(payload);

      if (value !== token) this.refreshError;

      return payload;
    } catch {
      throw this.refreshError;
    }
  }

  private getPayloadByToken(token: string, secret: string): UserSessionPayload {
    try {
      return this.jwtService.verify(token, { secret });
    } catch {
      this.accessError;
    }
  }

  public async blockedAllAccessByUserId(userId: string): Promise<void> {
    return '***'
  }

  private async findByPayload({
    jti,
    id,
  }: UserSessionPayload): Promise<null | Seance> {
    return this.findById(jti, FOIncludeUserById(id));
  }

  public async addBlackList(userId: string, jti: string) {
    return '***'
  }

  private async findById(
    id: string,
    options?: FindOptions,
  ): Promise<null | Seance> {
    return this.seance.findOne({ where: { id }, ...options });
  }

  private async getPayloadByUser(
    { id, email }: UserSuccessResponse,
    jti: string,
  ) {
    const iss = this.host;

    await this.roleService.updatePermissions(id);

    return {
      email,
      iss,
      jti,
      id,
    };
  }

  private async isBlocked(userId: string, jti: string): Promise<boolean> {
    return '***'
  }

  private async createRefresh(payload) {
    const expiresIn = this.refreshExpiration;
    const secret = this.refreshSecret;
    const token = this.generateToken(payload, expiresIn, secret);

    await this.seance.create({
      id: payload.jti,
      userId: payload.id,
      value: token,
    });

    return this.addBearer(token);
  }

  private createAccess(payload) {
    const expiresIn = this.accessExpiration;
    const secret = this.accessSecret;
    const token = this.generateToken(payload, expiresIn, secret);

    return this.addBearer(token);
  }

  private generateToken(payload, expiresIn, secret) {
    return this.jwtService.sign(payload, { expiresIn, secret });
  }

  private addBearer(token: string): string {
    return `Bearer ${token}`;
  }

  private get ttl(): number {
    return converterFromExp(this.accessExpiration, 's');
  }

  private get accessSecret(): string {
    return this.configService.get('***');
  }

  private get refreshSecret(): string {
    return this.configService.get('***');
  }

  private get blackListKey(): string {
    return this.configService.get('***');
  }

  private get accessExpiration(): string {
    return this.configService.get('***');
  }

  private get refreshExpiration(): string {
    return this.configService.get('***');
  }

  private get host(): string {
    return this.configService.get('***');
  }
}
