import { SequelizeModule } from '@nestjs/sequelize';
import { Global, Module } from '@nestjs/common';

import { CM } from '@common/utils';

import { RoleController } from '@modules/role/controllers';

import { RoleService } from '@modules/role/services';

import {
  CompanyPermission,
  RolePermission,
  Permission,
  Role,
} from '@modules/role/models';

import { PermissionGuard } from '@modules/role/guards';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      CompanyPermission,
      RolePermission,
      Permission,
      Role,
    ]),
    CM,
  ],
  providers: [RoleService, PermissionGuard],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
