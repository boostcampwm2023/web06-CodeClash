import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    switch (data) {
      case 'id':
        return req.user.id;
      case 'email':
        return req.user.email;
      case 'name':
        return req.user.name;
      default:
        return req.user;
    }
  },
);
