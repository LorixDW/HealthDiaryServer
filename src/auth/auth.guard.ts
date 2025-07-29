import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {Request} from 'express';
import { constant } from './constant';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if(token == null){
      throw new UnauthorizedException();
    }
    try {
      const res = await this.jwtService.verifyAsync(token, {
        secret: constant.secret
      }).then((payload) => {
        request['user'] = payload;
        return true;
      })
      return res;
    }catch (e){
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization
      ?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}