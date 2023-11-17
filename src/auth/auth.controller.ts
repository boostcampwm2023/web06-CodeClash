import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginByEmail(@User() user) {
    const { email, id } = user;
    return this.authService.loginUser({ email, id });
  }

  @Post('register/email')
  registerByEmail(@Body() registerByEmailDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerByEmailDto);
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  getAccessToken(@Token() token) {
    const newToken = this.authService.rotateToken(token, false);

    return {
      refreshToken: newToken,
    };
  }
}
