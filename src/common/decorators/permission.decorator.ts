import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { PermissionGuard } from '@modules/role/guards';

import { PERMISSION_KEY } from '@common/consts';

import { TPermission } from '@common/types/permission.types';

export const Permissions = (...permissions: TPermission[]) =>
  applyDecorators(
    SetMetadata(PERMISSION_KEY, permissions),
    UseGuards(PermissionGuard),
    ApiHeader({
      name: '***',
      example: 'UUID',
      required: true,
    }),
  );
