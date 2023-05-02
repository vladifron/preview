import { InjectConnection } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize';
import { Response } from 'express';
import {
  HttpException,
  Controller,
  Post,
  Body,
  Get,
  Res,
} from '@nestjs/common';

import { Authorize, Docs, Seance, UserID, UserInfo } from '@common/decorators';
import { transaction } from '@common/utils';

import { SeanceService } from '@modules/seance/services';
import { UserService } from '@modules/user/services';

import { User } from '@modules/user/models';

import {
  MessageSuccessResponse,
  UserConfirmationAuth,
  UserSuccessResponse,
  RequestNewCode,
  CreateUser,
  UserAuth,
} from '@modules/user/dtos';

import {
  updateSeance,
  newCode,
  confirm,
  logOut,
  signUp,
  logIn,
  me,
} from '../docs';

@ApiTags('User authorization')
@Controller('user')
export class UserController {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly userService: UserService,
    private readonly seanceService: SeanceService,
  ) {}

  @Docs(signUp, UserSuccessResponse)
  @Post('/signup')
  async create(
    @Body() user: CreateUser,
  ): Promise<HttpException | UserSuccessResponse> {
    return transaction(this.sequelize, () => this.userService.create(user));
  }

  @Docs(confirm, MessageSuccessResponse)
  @Post('/confirmation')
  async confirm(
    @Res() res: Response,
    @Body() dto: UserConfirmationAuth,
  ): Promise<void> {
    return transaction(this.sequelize, () =>
      this.userService.confirmation(res, dto),
    );
  }

  @Docs(logIn, UserSuccessResponse)
  @Post('/login')
  async login(
    @Body() auth: UserAuth,
  ): Promise<HttpException | UserSuccessResponse> {
    return transaction(this.sequelize, () => this.userService.login(auth));
  }

  @Docs(newCode, RequestNewCode)
  @Post('/code/resend')
  async newCode(
    @Body() { email }: RequestNewCode,
  ): Promise<HttpException | UserSuccessResponse> {
    return transaction(this.sequelize, () => this.userService.newCode(email));
  }

  @Docs(updateSeance, MessageSuccessResponse)
  @Seance()
  @Get('/seance/update')
  async refreshTokens(
    @Res() response: Response,
    @UserInfo() user,
  ): Promise<void> {
    return transaction(this.sequelize, () =>
      this.seanceService.update(response, user),
    );
  }

  @Docs(logOut, MessageSuccessResponse)
  @Seance()
  @Get('/seance/remove')
  async removeSeance(
    @Res() response: Response,
    @UserInfo() user,
  ): Promise<void> {
    return transaction(this.sequelize, () =>
      this.seanceService.remove(response, user),
    );
  }

  @Docs(me, User)
  @Authorize()
  @Get('/')
  getCurrentUser(@UserID() userId: string): Promise<HttpException | User> {
    return this.userService.getById(userId);
  }
}
