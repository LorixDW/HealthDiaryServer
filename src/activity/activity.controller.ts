import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { GetCategoryByIdParams } from './dto/get-category-by-id.params';
import { GetAllActivityQuery } from './dto/get-all-activity.query';
import { AddActivityBody } from './dto/add-activity.body';
import { UpdateActivityBody } from './dto/update-activity.body';
import { CategoryService } from './category.service';
import { SubcategoryService } from './subcategory.service';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('activity')
export class ActivityController {
  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private activityService: ActivityService
  ) {}

  @Get('category/all')
  @UseGuards(AuthGuard)
  async getCategoryAll(
    @Request() request
  ){
    return (await this.categoryService.getAll()).map((e) => e.toResponse())
  }

  @Get('category/:id')
  @UseGuards(AuthGuard)
  async getCategoryById(
    @Request() request,
    @Param() params: GetCategoryByIdParams
  ){
    return (await this.categoryService.getById(params.id)).toResponse()
  }

  @Get('subcategory/all')
  @UseGuards(AuthGuard)
  async getSubcategoryAll(
    @Request() request
  ){
    return (await this.subcategoryService.getAll()).map((e) => e.toResponse())
  }

  @Get('subcategory/:id')
  @UseGuards(AuthGuard)
  async getSubcategoryById(
    @Request() request,
    @Param() params: GetCategoryByIdParams
  ){
    return (await this.subcategoryService.getById(params.id)).toResponse()
  }

  @Get('record/all')
  @UseGuards(AuthGuard)
  async getRecordAll(
    @Request() request,
    @Query() query: GetAllActivityQuery
  ){
    return (await this.activityService.getAll(query.record_id, request.user.sub)).map((e) => e.toResponse())
  }

  @Get('record/:id')
  @UseGuards(AuthGuard)
  async getRecordById(
    @Request() request,
    @Param() params: GetCategoryByIdParams
  ){
    return (await this.activityService.getById(params.id, request.user.sub)).toResponse()
  }

  @Post('record')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async addRecord(
    @Request() request,
    @Body() body: AddActivityBody
  ){
    return (await this.activityService.add(body, request.user.sub)).toResponse()
  }

  @Put('record')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async updateRecord(
    @Request() request,
    @Body() body: UpdateActivityBody
  ){
    return (await this.activityService.update(body, request.user.sub)).toResponse()
  }

  @Delete('record/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteRecord(
    @Request() request,
    @Param() params: GetCategoryByIdParams
  ){
    return await this.activityService.delete(params.id, request.user.sub)
  }
}