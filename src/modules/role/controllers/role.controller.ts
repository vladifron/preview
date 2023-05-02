import { HttpException, Controller, Patch, Body, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize';

import { transaction } from '@common/utils';
import {
  QueryValidate,
  Permissions,
  Authorize,
  CompanyId,
  UserID,
  Docs,
} from '@common/decorators';

import { RoleService } from '@modules/role/services';

import { Permission, Role } from '@modules/role/models';

import {
  ResponseMyRoles,
  EditPermission,
  EditRoleByUser,
  EditRole,
} from '@modules/role/dto';

import {
  getPermissionsByRoleId,
  changeRoleByUser,
  editPermission,
  getRoleById,
  getMyRoles,
  editRole,
  getRoles,
} from '@modules/role/docs/';

import { PermissionEnum } from '@modules/role/enums';

@Authorize()
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly roleService: RoleService,
  ) {}

  @Docs(getRoles, [Role])
  @Get()
  getRoles(): Promise<Role[]> {
    return this.roleService.getRoles();
  }

  @Docs(getRoleById, Role)
  @Get('current')
  getRoleById(
    @QueryValidate('id') roleId: string,
  ): Promise<HttpException | Role> {
    return this.roleService.getRoleById(roleId);
  }

  @Docs(getPermissionsByRoleId, [Permission])
  @Get('permissions')
  getPermissionsByRoleId(
    @QueryValidate('id') roleId: string,
  ): Promise<HttpException | Permission[]> {
    return this.roleService.getPermissionsByRoleId(roleId);
  }

  @Docs(getMyRoles, [ResponseMyRoles])
  @Get('my')
  myRoles(@UserID() userId: string): Promise<ResponseMyRoles[]> {
    return this.roleService.getMyRoles(userId);
  }

  @Docs(editRole, Role)
  @Patch()
  editRole(@Body() dto: EditRole): Promise<HttpException | Role> {
    return transaction(this.sequelize, () => this.roleService.editRole(dto));
  }

  @Docs(editPermission, Permission)
  @Patch('permission')
  editPermission(
    @Body() dto: EditPermission,
  ): Promise<HttpException | Permission> {
    return transaction(this.sequelize, () =>
      this.roleService.editPermission(dto),
    );
  }

  @Permissions(PermissionEnum.EDIT_ROLE)
  @Docs(changeRoleByUser, null)
  @Patch('/user/change')
  changeUserRole(
    @Body() dto: EditRoleByUser,
    @CompanyId() companyId: string,
  ): Promise<HttpException | void> {
    return transaction(this.sequelize, () =>
      this.roleService.changeUserRole(dto, companyId),
    );
  }
}
