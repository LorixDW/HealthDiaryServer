import { InjectRepository } from '@nestjs/typeorm';
import { MealTime } from '../models/meal-time';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class MealTimeService{
  constructor(
    @InjectRepository(MealTime)
    private readonly mealTimeRepository: Repository<MealTime>
  ) {}

  async getAll(): Promise<MealTime[]>{
    return this.mealTimeRepository.find()
  }

  async getById(id: number): Promise<MealTime>{
    const mealTime = this.mealTimeRepository.findOne({
      where: {
        id: id
      }
    })
    if(mealTime == null){
      throw new HttpException(`There is no meal type with id ${id}`, HttpStatus.NOT_FOUND)
    }
    return mealTime
  }
}