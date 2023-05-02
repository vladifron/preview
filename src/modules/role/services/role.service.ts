import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import {
  CACHE_MANAGER,
  HttpException,
  forwardRef,
  Injectable,
  Inject,
} from '@nestjs/common';

import { converterFromExp } from '@common/utils';

import { ErrorBase } from '@common/errors';

import { SeanceService } from '@modules/seance/services';

import {
  CompanyPermission,
  RolePermission,
  Permission,
  Role,
} from '@modules/role/models';

import { RoleEnum } from '@modules/role/enums';

import { TSchema } from '@common/types';

import {
  roleById,
  ByTitle,
  roles,
} from '@modules/role/query';

@Injectable()
export class RoleService extends ErrorBase {
  constructor(
    private readonly configService: ConfigService<TSchema>,
    @Inject(forwardRef(() => SeanceService))
    private readonly seanceService: SeanceService,
    @InjectModel(Role)
    private readonly role: typeof Role,
    @InjectModel(Permission)
    private readonly permission: typeof Permission,
    @InjectModel(CompanyPermission)
    private readonly companyPermission: typeof CompanyPermission,
    @InjectModel(RolePermission)
    private readonly rolePermission: typeof RolePermission,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  public async getRoles(): Promise<Role[]> {
    return this.role.findAll(roles);
  }

  public async findByValue(value: RoleEnum) {
    return this.role.findOne({
      where: { value },
      include: {
        model: Permission,
      },
    });
  }

  private async findPermissionById(id: string): Promise<null | Permission> {
    return this.permission.findOne({
      where: { id },
      attributes: ['***', '***'],
    });
  }

  private async findById(id: string): Promise<null | Role> {
    const options = roleById(id);

    return this.role.findOne(options);
  }

  private async deletePermissionsByRoleId(roleId: string): Promise<void> {
    await this.rolePermission.destroy({ where: { roleId } });
  }

  private async createPermissionsByRoleId(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.rolePermission.bulkCreate(rolePermissions);
  }

  private async reloadPermissionsByRoleId(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    if (!permissionIds.length) return;

    await this.deletePermissionsByRoleId(roleId);
    await this.createPermissionsByRoleId(roleId, permissionIds);
  }


  private async checkExistRole(title: string): Promise<void | HttpException> {
    const options = ByTitle(title);

    const candidate = await this.role.findOne(options);

    if (candidate) this.alreadyExist('***', { title });
  }

  private async checkExistPermission(
    title: string,
  ): Promise<void | HttpException> {
    const options = ByTitle(title);

    const candidate = await this.permission.findOne(options);

    if (candidate) this.alreadyExist('***', { title });
  }

  private get ttl(): number {
    return converterFromExp(this.accessExpiration, 's');
  }

  private get accessExpiration(): string {
    return this.configService.get('***');
  }
}
