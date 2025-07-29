import { Controller, Get, HttpException, HttpStatus, UseGuards, Request, Put, Body, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserShortResponse } from './dto/response/user.short.response';
import { UserUpdateRequest } from './dto/request/user.update.request';
import { User } from '../models/user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async getAll(){
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getCurrent(
    @Request() request
  ){
    const user = await this.userService.getUserById(request.user.sub);
    return user.toResponse();
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(201)
  async updateUserData(@Body() userData: UserUpdateRequest, @Request() request){
    const user = await this.userService.updateData(
      userData,
      request.user.sub
    );
    console.log(user)
    return user.toResponse();
  }
}
