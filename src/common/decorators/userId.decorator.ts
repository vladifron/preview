import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserSessionPayload } from '@modules/user/dtos';

const jwtService: JwtService = new JwtService();

export const UserID = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const user = <UserSessionPayload>jwtService.decode(token, {
      json: true,
    });
    return user.id;
  },
);
