import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CM } from '@common/utils';


import { UserController } from '@modules/user/controllers';

import { UserService } from '@modules/user/services';

import { Seance } from '@modules/seance/models';
import { User } from '@modules/user/models';

@Module({
  imports: [
    CM,
    PassportModule,
    SequelizeModule.forFeature([User, Seance]),
    JwtModule.register({ signOptions: { expiresIn: '7d' } }),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
  exports: [ConfigService],
})
export class UserModule {}
