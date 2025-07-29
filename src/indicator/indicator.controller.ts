import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { IndicatorService } from './indicator.service'
import { GetIndicatorByIdParams } from './dto/get-indicator-by-id.params';
import { AuthGuard } from '../auth/auth.guard';

@Controller('indicator')
export class IndicatorController{
  constructor(
    private indicatorService: IndicatorService
  ) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async getAll(
    @Request() request
  ){
    return (await this.indicatorService.getAll()).map((e) => e.toResponse())
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(
    @Request() request,
    @Param() params: GetIndicatorByIdParams
  ){
    return (await this.indicatorService.getById(params.id)).toResponse()
  }
}