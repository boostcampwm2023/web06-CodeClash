import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserTable } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  signToken(
    user: Pick<UserTable, 'email' | 'id'>,
    isRefreshToken: boolean,
  ): string {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: isRefreshToken ? '7d' : '1d',
    });
  }

  loginUser(user: Pick<UserTable, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2) {
      throw new UnauthorizedException('wrong header');
    }

    const prefix = splitToken[0];
    if (
      (isBearer && prefix !== 'Bearer') ||
      (!isBearer && prefix !== 'Basic')
    ) {
      throw new UnauthorizedException('wrong header');
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!email || !password) throw new UnauthorizedException('wrong token');

    return { email, password };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('token is expired or invalid token');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        'accessToken is only published with refresh token',
      );
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UserTable, 'email' | 'password'>,
  ) {
    const exUser = await this.usersService.getUserByEmail(user.email);

    if (!exUser) {
      throw new UnauthorizedException('not exist user');
    }

    const isMatch = await bcrypt.compare(user.password, exUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('wrong password');
    }

    return exUser;
  }

  async loginWithEmail(user: Pick<UserTable, 'email' | 'password'>) {
    const exUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(exUser);
  }

  async registerWithEmail(
    user: Pick<UserTable, 'name' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, 10);

    const newUser = await this.usersService.create({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
