import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { GetMeasurementInfoQuery } from './dto/get-measurement-info.query';
import { AnalyzeService } from './analyze.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('analyze')
export class AnalyzeController{
  constructor(
    private analyzeService: AnalyzeService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getInfo(
    @Request() request,
    @Query() query: GetMeasurementInfoQuery
  ){
    return await this.analyzeService.getInfo(query, request.user.sub)
  }
}