import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  registerByEmail(@Body() registerByEmailDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerByEmailDto);
  }
}
