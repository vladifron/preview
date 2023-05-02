import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { CM } from '@common/utils';

import { JwtRefresh, JwtAccess } from '@modules/user/strategies';

import { SeanceService, CookieService } from '@modules/seance/services';

import { Seance } from '@modules/seance/models';

@Global()
@Module({
  imports: [
    CM,
    PassportModule,
    SequelizeModule.forFeature([Seance]),
    JwtModule.register({ signOptions: { expiresIn: '7d' } }),
  ],
  controllers: [],
  providers: [SeanceService, CookieService, JwtAccess, JwtRefresh],
  exports: [SeanceService, CookieService, JwtAccess, JwtRefresh],
})
export class SeanceModule {}
