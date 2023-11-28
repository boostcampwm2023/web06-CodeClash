import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AccessTokenGuard } from './bearer-token.guard';

export class AdminGuard extends AccessTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();

    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('this user is not admin');
    }

    return true;
  }
}
