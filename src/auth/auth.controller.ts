import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthRequest } from './dto/request/auth.request';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/response/auth.response';
import { User } from '../models/user';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService,
              private jwtService: JwtService) {
  }
  @Post('/register')
  async register(
    @Body() authRequest: AuthRequest
  ) {
    const user = await this.userService.register(authRequest.login, authRequest.password);
    return new AuthResponse(await this.jwtService.signAsync({
      username: user.login,
      sub: user.id,
    }))
  }

  @Post('/login')
  async login(
    @Body() authRequest: AuthRequest
  ){
    const user: User = await this.userService.login(authRequest.login, authRequest.password);
    return new AuthResponse(await this.jwtService.signAsync({
      username: user.login,
      sub: user.id
    }))
  }
}
