import { MeasurementService } from './measurement.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { GetAllMeasurementsQuery } from './dto/get-all-measurements.query';
import { GetMeasurementByIdParams } from './dto/get-measurement-by-id.params';
import { AddMeasurementBody } from './dto/add-measurement.body';
import { UpdateMeasurementBody } from './dto/update-measurement.body';
import { DeleteMeasurementParams } from './dto/delete-measurement.params';
import { AuthGuard } from '../auth/auth.guard';

@Controller('measurement')
export class MeasurementController{
  constructor(
    private measurementService: MeasurementService
  ) {}

  @UseGuards(AuthGuard)
  @Get('/all')
  async getAll(
    @Request() request,
    @Query() query: GetAllMeasurementsQuery
  ){
    return (await this.measurementService.getAll(query.record_id, request.user.sub)).map((e) => e.toResponse())
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(
    @Request() request,
    @Param() params: GetMeasurementByIdParams
  ){
    return (await this.measurementService.getById(params.id, request.user.sub)).toResponse()
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  async add(
    @Request() request,
    @Body() body: AddMeasurementBody
  ){
    return (await this.measurementService.add(body.recordId, body.time, request.user.sub)).toResponse()
  }

  @UseGuards(AuthGuard)
  @Put()
  @HttpCode(201)
  async update(
    @Request() request,
    @Body() body: UpdateMeasurementBody
  ){
    return (await this.measurementService.update(body.id, body.time, body.measurementsIndicators, request.user.sub)).toResponse()
  }

  @UseGuards(AuthGuard)
  @Delete('indicator/:id')
  @HttpCode(204)
  async deleteIndicator(
    @Request() request,
    @Param() body: DeleteMeasurementParams
  ){
    await this.measurementService.deleteIndicator(body.id, request.user.sub)
    return 'deleted indicator'
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Request() request,
    @Param() body: DeleteMeasurementParams
  ){
    await this.measurementService.delete(body.id, request.user.sub)
    return 'deleted measurement'
  }
}