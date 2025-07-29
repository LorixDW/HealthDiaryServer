import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../models/meal';
import { Repository } from 'typeorm';
import { MealDish } from '../models/meal-dish';
import { RecordService } from '../record/record.service';
import { DishService } from '../dish/dish.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddDishBody } from './dto/add-dish.body';
import { AddMealBody } from './dto/add-meal.body';
import { MealTimeService } from './meal-time.service';
import { UpdateMealBody } from './dto/update-meal.body';
import { UpdateDishBody } from './dto/update-dish.body';

@Injectable()
export class MealService{
  constructor(
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(MealDish)
    private mealDishRepository: Repository<MealDish>,
    private recordService: RecordService,
    private dishService: DishService,
    private mealTimeService: MealTimeService
  ) {}

  async getAll(record_id: number, user_id): Promise<Meal[]>{
    const record = await this.recordService.getById(record_id, user_id)
    return this.mealRepository.find({
      where:{
        record: {
          id: record.id
        }
      },
      relations: ['record', 'mealTime', 'mealDishes', 'mealDishes.serving', 'mealDishes.serving.dish']
    })

  }

  async getById(meal_id: number, user_id:number): Promise<Meal>{
    const meal = await this.mealRepository.findOne({
      where:{
        id: meal_id
      },
      relations: ['record', 'mealTime', 'mealDishes', 'mealDishes.serving', 'mealDishes.serving.dish', 'record.user']
    })
    if(meal == null){
      throw new HttpException(`There is no meal with id ${meal_id}`, HttpStatus.NOT_FOUND)
    }
    if(meal.record.user.id != user_id){
      throw new HttpException('This record is not yours', HttpStatus.FORBIDDEN)
    }
    return meal
  }

  async add(body: AddMealBody, user_id: number): Promise<Meal>{
    const record = await this.recordService.getById(body.record_id, user_id)
    if(record.isDeleted){
      throw new HttpException('You can not edit the deleted records', HttpStatus.FORBIDDEN)
    }
    const mealTime = body.type_id != null ? await this.mealTimeService.getById(body.type_id) : null
    const meal = new Meal(
      body.time != null ? new Date(0,0, 0,body.time.hours, body.time.minutes) : null,
      body.note,
      mealTime,
      record
    )
    return this.mealRepository.save(meal)
  }

  async update(body: UpdateMealBody, user_id: number): Promise<Meal>{
    const meal = await this.getById(body.id, user_id)
    if(body.type_id != null){
      meal.mealTime = await this.mealTimeService.getById(body.type_id)
    }
    if(body.time != null){
      meal.time = new Date(0,0, 0,body.time.hours, body.time.minutes)
    }
    if(body.note != null){
      meal.note = body.note
    }
    return this.mealRepository.save(meal)
  }

  async delete(meal_id: number, user_id: number): Promise<boolean>{
    const meal = await this.getById(meal_id, user_id)
    try {
      await this.mealRepository.remove(meal)
      return true
    }catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }

  async getMealDishById(id: number, user_id): Promise<MealDish>{
    const mealDish = await this.mealDishRepository.findOne({
      where: {
        id: id
      },
      relations: ['meal.record', 'meal.record.user', 'meal.mealTime', 'meal', 'serving', 'serving.dish']
    })
    if(mealDish == null){
      throw new HttpException(`There is no meal dish with id ${id}`, HttpStatus.NOT_FOUND)
    }
    if(mealDish.meal.record.user.id != user_id){
      throw new HttpException('This record id not yours', HttpStatus.FORBIDDEN)
    }
    return mealDish
  }

  async addDish(body: AddDishBody, user_id: number): Promise<MealDish>{
    const meal = await this.getById(body.meal_id, user_id)
    const serving = await this.dishService.getServingById(body.serving_id)
    const mealDish = new MealDish(
      body.value,
      meal,
      serving
    )
    return this.mealDishRepository.save(mealDish)
  }

  async updateDish(body: UpdateDishBody, user_id): Promise<MealDish>{
    const mealDish = await this.getMealDishById(body.id, user_id)
    mealDish.count = body.value
    return this.mealDishRepository.save(mealDish)
  }

  async deleteDish(id: number, user_id): Promise<boolean>{
    const mealDish = await this.getMealDishById(id, user_id)
    try {
      await this.mealDishRepository.remove(mealDish)
      return true
    }catch (e){
      throw new HttpException('Something went wrong', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }
}