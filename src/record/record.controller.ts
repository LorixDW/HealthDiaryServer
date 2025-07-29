import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { GetRecordByIdParams } from './dto/request/get-record-by-id.params';
import { AuthGuard } from '../auth/auth.guard';
import { GetRecordByDateQuery } from './dto/request/get-record-by-date.query';
import { AddRecordRequest } from './dto/request/add-record.request';
import { UpdateRecordRequest } from './dto/request/update-record.request';
import { DeleteRecordQuery } from './dto/request/delete-record.query';
import { DeleteRecordParams } from './dto/request/delete-record.params';
import { GetAllRecordsQuery } from './dto/request/get-all-records.query';

@Controller('record')
export class RecordController {
  constructor(
    private recordService: RecordService
  ) {}

  @Get('all')
  @UseGuards(AuthGuard)
  async getAll(
    @Request() request,
    @Query() query: GetAllRecordsQuery
  ){
    return (await this.recordService.getAll(query.year, query.month, request.user.sub))
      .map((e) => e.toShortResponse());
  }

  @UseGuards(AuthGuard)
  @Get()
  async getByDay(
    @Request() request,
    @Query() query: GetRecordByDateQuery
  ){
    return (await this.recordService.getByDate(new Date(query.date), request.user.sub)).toFullResponse()
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(
    @Request() request,
    @Param() param: GetRecordByIdParams
  ){
    return (await this.recordService.getById(param.id, request.user.sub)).toFullResponse()
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  async add(
    @Request() request,
    @Body() body: AddRecordRequest
  ){
    return (await this.recordService.add(new Date(body.date), body.note, request.user.sub)).toFullResponse();
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(201)
  async update(
    @Request() request,
    @Body() body: UpdateRecordRequest
  ){
    return (await this.recordService.update(body.id, body.note, request.user.sub)).toFullResponse();
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Request() request,
    @Param() param: DeleteRecordParams,
    @Query() query: DeleteRecordQuery,
  ) {
    return (await this.recordService.delete(param.id, query.action, request.user.sub)).toFullResponse();
  }
}