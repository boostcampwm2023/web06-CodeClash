import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

export class SocketBearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const headers = client.handshake.headers;
    const rawToken = headers.Authorization;

    if (!rawToken) {
      throw new WsException('Token not found');
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      client.user = user;
      client.token = token;
      client.tokenType = payload.type;

      return true;
    } catch (e) {
      throw new WsException('Token is invalid');
    }
  }
}
