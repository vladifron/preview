import { ApiHeader, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { applyDecorators, UseGuards } from '@nestjs/common';

import { AccessGuard } from '@modules/user/guards';

export const Authorize = () =>
  applyDecorators(
    UseGuards(AccessGuard),
    ApiHeader({
      name: 'Authorization',
      example: 'Bearer token',
      required: true,
    }),
    ApiUnauthorizedResponse({
      description: `Access token is not valid.`,
    }),
  );
