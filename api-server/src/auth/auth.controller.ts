import {
  Body,
  Controller,
  Post,
  UseGuards,
  Response,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { Token } from './decorators/token.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginByEmail(@User() user, @Response() res) {
    const { email, id } = user;

    const { accessToken, refreshToken } = await this.authService.loginUser({
      email,
      id,
    });

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      .send({
        accessToken,
        userName: user.name,
        email: user.email,
        acceptCount: user.acceptCount,
        failCount: user.failCount,
        winCount: user.winCount,
        totalCount: user.totalCount,
      });
  }

  @Post('register/email')
  async registerByEmail(
    @Body() registerByEmailDto: RegisterUserDto,
    @Response() res,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.registerWithEmail(registerByEmailDto);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      .send({
        accessToken,
        userName: user.name,
        email: user.email,
        acceptCount: user.acceptCount,
        failCount: user.failCount,
        winCount: user.winCount,
        totalCount: user.totalCount,
      });
  }

  @Get('token/access')
  @UseGuards(RefreshTokenGuard)
  getAccessToken(@Token() token) {
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }
}
