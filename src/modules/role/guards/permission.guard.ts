import { Reflector } from '@nestjs/core';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { COMPANY_KEY, PERMISSION_KEY, SYSTEM_PERMISSION } from '@common/consts';

import { TLocalizePath, TPermission } from '@common/types';
import { RoleService } from '@modules/role/services';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<TPermission[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user, headers } = context.switchToHttp().getRequest();

    const id = user?.id;

    if (!id) throw this.unauthorized;

    const permissions = await this.roleService.getRedis(id);

    if (permissions?.includes(SYSTEM_PERMISSION)) return true;

    const companyHeader = headers[COMPANY_KEY];

    if (!companyHeader) this.exception;

    const isSuccess = requiredPermissions?.some((permission) =>
      permissions?.includes(`${companyHeader}__${permission}`),
    );

    if (!isSuccess) this.forbidden;

    return isSuccess;
  }

  get exception(): HttpException {
    throw this.getException(
      '***',
      HttpStatus.FORBIDDEN,
    );
  }

  get forbidden(): HttpException {
    throw this.getException('***', HttpStatus.FORBIDDEN);
  }

  get unauthorized(): HttpException {
    throw this.getException('***', HttpStatus.UNAUTHORIZED);
  }

  getException(message: TLocalizePath, statusCode: HttpStatus): HttpException {
    throw new HttpException(
      {
        statusCode,
        message,
      },
      statusCode,
    );
  }
}
