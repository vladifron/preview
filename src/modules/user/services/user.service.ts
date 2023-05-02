import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { FindOptions } from 'sequelize';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import {
  CACHE_MANAGER,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';

import { Hasher, messageTemplate } from '@common/utils';
import { ErrorBase } from '@common/errors';

import { SeanceService } from '@modules/seance/services';
import { MailService } from '@modules/mail/services';

import { User } from '@modules/user/models';

import {
  UserConfirmationAuth,
  UserSuccessResponse,
  CreateUser,
  UserAuth,
} from '@modules/user/dtos';

import { FOUserById } from '@modules/user/query';

import { TSchema } from '@common/types';

@Injectable()
export class UserService extends ErrorBase {
  constructor(
    private readonly configService: ConfigService<TSchema>,
    private readonly mailService: MailService,
    private readonly seanceService: SeanceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    super();
  }

  public async addToRedis<B>(key: string, value: B, ttl = this.confirmTTL) {
    await this.cacheManager.set(key, value, { ttl });
  }

  public async generateCode(email: string) {
    const code = this.code;
    const hashedCode = await this.hasher.hash(code);

    await this.addToRedis<string>(email, hashedCode);

    return code;
  }

  public async getById(id: string): Promise<HttpException | User> {
    const candidate = await this.findById(id, FOUserById(id));

    if (!candidate) this.notFound(`user.not_found.by_id`, { id });

    return candidate;
  }

  public async getByEmail(
    email: string,
    excluded = ['***'],
  ): Promise<User> {
    const candidate = await this.userModel.findOne({
      where: { email },
      attributes: {
        exclude: ['***', '***', '***', ...excluded],
      },
    });

    if (!candidate) this.userIncorrect;

    return candidate;
  }

  public async newCode(
    email: string,
  ): Promise<HttpException | UserSuccessResponse> {
    const { id } = await this.findByEmail(email);

    if (!id) this.notFound('user.not_found.by_email', { email });

    return this.sendEmail({ id, email });
  }

  public async create(
    dto: CreateUser,
  ): Promise<HttpException | UserSuccessResponse> {
    const candidate = await this.findByEmail(dto.email);

    if (candidate) this.alreadyExist('user.exist.email', { email: dto.email });

    const { id, email } = await this.userModel.create({ ...dto });

    return this.sendEmail({ id, email });
  }

  public async login(
    user: UserAuth,
  ): Promise<HttpException | UserSuccessResponse> {
    const { email, password } = user;

    const checkUser = await this.getByEmail(email, []);

    const checkPassword = await this.hasher.comparer(
      password,
      checkUser.password,
    );

    if (!checkPassword) this.userIncorrect;

    return this.sendEmail(checkUser);
  }

  public async sendEmail({
    id,
    email,
  }: UserSuccessResponse): Promise<HttpException | UserSuccessResponse> {
    try {
      const code = await this.generateCode(email);

      await this.mailService.send(email, messageTemplate(code));

      return {
        id,
        email,
      };
    } catch (e) {
      this.invalidSendEmail(`user.not_found.by_id`);
    }
  }

  public async processCode({
    email,
    code,
  }: UserConfirmationAuth): Promise<UserSuccessResponse> {
    const redisCode = await this.cacheManager.get(email);
    const checkCode =
      redisCode && (await this.hasher.comparer(code, redisCode));

    if (!checkCode) this.errorConfirmCode;

    const user = await this.getByEmail(email);

    await this.cacheManager.del(email);

    return {
      id: user.id,
      email: user.email,
    };
  }

  public async confirmation(
    res: Response,
    body: UserConfirmationAuth,
  ): Promise<void> {
    const user = await this.processCode(body);
    return this.seanceService.create(res, user);
  }

  private findById(id: string, options?: FindOptions): Promise<User | null> {
    return this.userModel.findOne({ where: { id }, ...options });
  }

  private findByEmail(
    email: string,
    options?: FindOptions,
  ): Promise<User | null> {
    return this.userModel.findOne({ where: { email }, ...options });
  }

  private get code(): string {
    return '***';
  }

  private get hasher(): Hasher {
    return new Hasher();
  }

  private get confirmTTL(): number {
    return this.configService.get<number>('***');
  }
}
