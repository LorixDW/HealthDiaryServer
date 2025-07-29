import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { GetByIdParams } from './dto/get-by-id.params';
import { AddNotificationBody } from './dto/add-notification.body';
import { UpdateNotificationBody } from './dto/update-notification.body';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notification')
export class NotificationController{
  constructor(
    private notificationService: NotificationService
  ) {}

  @Get('type/all')
  @UseGuards(AuthGuard)
  async getAllTypes(
    @Request() request
  ){
    return (await this.notificationService.getTypeAll()).map((e) => e.toResponse())
  }

  @Get('type/:id')
  @UseGuards(AuthGuard)
  async getTypeById(
    @Request() request,
    @Param() params: GetByIdParams
  ){
    return (await this.notificationService.getTypeById(params.id)).toResponse()
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAll(
    @Request() request
  ){
    return (await this.notificationService.getAll(request.user.sub)).map((e) => e.toResponse())
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(
    @Request() request,
    @Param() params: GetByIdParams
  ){
    return (await this.notificationService.getById(params.id, request.user.sub)).toResponse()
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async add(
    @Request() request,
    @Body() body: AddNotificationBody
  ){
    return (await this.notificationService.add(body, request.user.sub)).toResponse()
  }

  @Put()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async update(
    @Request() request,
    @Body() body: UpdateNotificationBody
  ){
    return (await this.notificationService.update(body, request.user.sub)).toResponse()
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async delete(
    @Request() request,
    @Param() params: GetByIdParams
  ){
    await this.notificationService.delete(params.id, request.user.sub)
  }
}