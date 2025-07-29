import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { GetMealByIdParams } from './dto/get-meal-by-id.params';
import { MealTimeService } from './meal-time.service';
import { GetAllMealsQuery } from './dto/get-all-meals.query';
import { AddMealBody } from './dto/add-meal.body';
import { UpdateMealBody } from './dto/update-meal.body';
import { AddDishBody } from './dto/add-dish.body';
import { UpdateDishBody } from './dto/update-dish.body';
import { MealService } from './meal.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/meal')
export class MealController{
  constructor(
    private mealTimeService: MealTimeService,
    private mealService: MealService
  ) {}

  @Get('type/all')
  @UseGuards(AuthGuard)
  async getTypeAll(
    @Request() request,
  ){
    return (await this.mealTimeService.getAll()).map((e) => e.toResponse())
  }

  @Get('type/:id')
  @UseGuards(AuthGuard)
  async getTypeByID(
    @Request() request,
    @Param() param: GetMealByIdParams
  ){
    return (await this.mealTimeService.getById(param.id)).toResponse()
  }

  @Post('dish')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async addDish(
    @Request() request,
    @Body() body: AddDishBody
  ){
    return (await this.mealService.addDish(body, request.user.sub)).toResponse()
  }

  @Put('dish')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async updateDish(
    @Request() request,
    @Body() body: UpdateDishBody
  ){
    return (await this.mealService.updateDish(body, request.user.sub)).toResponse()
  }

  @Delete('dish/:id')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteDish(
    @Request() request,
    @Param() params: GetMealByIdParams
  ){
    await this.mealService.deleteDish(params.id, request.user.sub)
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAll(
    @Request() request,
    @Query() query: GetAllMealsQuery
  ){
    return (await this.mealService.getAll(query.record_id, request.user.sub)).map((e) => e.toResponse())
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(
    @Request() request,
    @Param() params: GetMealByIdParams
  ){
    return (await this.mealService.getById(params.id, request.user.sub)).toFullResponse()
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async add(
    @Request() request,
    @Body() body: AddMealBody
  ){
    return (await this.mealService.add(body, request.user.sub)).toFullResponse()
  }

  @Put()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async update(
    @Request() request,
    @Body() body: UpdateMealBody
  ){
    return (await this.mealService.update(body, request.user.sub)).toFullResponse()
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async delete(
    @Request() request,
    @Param() params: GetMealByIdParams
  ){
    await this.mealService.delete(params.id, request.user.sub)
  }
}