import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { DishService } from './dish.service';
import { GetDishListQuery } from './dto/get-dish-list.query';
import { GetDishByIdParams } from './dto/get-dish-by-id.params';
import { AuthGuard } from '../auth/auth.guard';

@Controller('dish')
export class DishController{
  constructor(
    private dishService: DishService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getDishList(
    @Request() request,
    @Query() query: GetDishListQuery
  ){
    return (await this.dishService.getList(query.expression, query.max_results, query.page_number)).map((e) => e.toResponse())
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(
    @Request() request,
    @Param() params: GetDishByIdParams
  ){
    return (await this.dishService.getById(params.id)).toFullResponse()
  }
}