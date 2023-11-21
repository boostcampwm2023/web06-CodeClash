import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('no token provided');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const decode = this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(decode.email);

    req.token = token;
    req.tokenType = decode.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('this is not access token');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // get refresh token from cookie
    const rawToken = req.cookies.refreshToken;

    if (!rawToken) {
      throw new UnauthorizedException('no refresh token provided');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const decode = this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(decode.email);

    req.token = token;
    req.tokenType = decode.type;
    req.user = user;

    return true;
  }
}
