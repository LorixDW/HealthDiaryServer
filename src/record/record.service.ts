import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Record } from '../models/record';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class RecordService{
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    private userService: UserService
  ) {}

  async getById(record_id: number, user_id: number): Promise<Record>{
    const user = await this.userService.getUserById(user_id);
    let record = await this.recordRepository.findOne({
      where: {
        id: record_id
      },
      relations: ['user', 'measurements', 'physicalActivities', 'meals', 'measurements.measurementIndicators', 'measurements.measurementIndicators.indicator',
      'physicalActivities.subcategory', 'physicalActivities.subcategory.category', 'meals.mealTime', 'meals.mealDishes', 'meals.mealDishes.serving',
      'meals.mealDishes.serving.dish']
    })
    if(record == null){
      throw new HttpException('There is no record with such id', HttpStatus.NOT_FOUND)
    }
    if(record.user.id != user.id){
      throw new HttpException('This record is not yours', HttpStatus.FORBIDDEN)
    }
    return record;
  }

  async getByDate(date: Date, user_id: number): Promise<Record>{
    const user = await this.userService.getUserById(user_id);
    const record = await this.recordRepository.findOne({
      where: {
        date: date,
        user: user
      },
      relations: ['user', 'measurements', 'physicalActivities', 'meals', 'measurements.measurementIndicators', 'measurements.measurementIndicators.indicator',
        'physicalActivities.subcategory', 'physicalActivities.subcategory.category', 'meals.mealTime', 'meals.mealDishes', 'meals.mealDishes.serving',
        'meals.mealDishes.serving.dish']
    })
    if(record == null){
      throw new HttpException('There is no your record for such day', HttpStatus.NOT_FOUND)
    }
    return record;
  }

  async getAll(year: number, month: number, user_id: number): Promise<Record[]>{
    const user = await this.userService.getUserById(user_id);
    return this.recordRepository.find({
      where: {
        user: user,
        date: Between(new Date(year, month - 1, 0), new Date(year, month, 1))
      },
      relations: ['user']
    })
  }

  async add(date: Date, note: string | null, user_id: number): Promise<Record>{
    const user = await this.userService.getUserById(user_id);
    if(await this.recordRepository.findOne({ where: { user: user, date: new Date(date) }, relations: ['user'] }) == null){
      let record = new Record(date, note, user);
      record = await this.recordRepository.save(record);
      return this.getById(Number(record.id), user_id)
    }else{
      throw new HttpException('There are exists your record with such date', HttpStatus.CONFLICT);
    }
  }

  async update(record_id: number, note: string | null, user_id): Promise<Record>{
    const record = await this.getById(record_id, user_id);
    if(note != null) record.note = note
    if(record.isDeleted){
      throw new HttpException('You can not update deleted records', HttpStatus.FORBIDDEN)
    }
    console.log(record_id, note)
    return this.recordRepository.save(record);
  }

  async delete(record_id: number, action: boolean, user_id: number){
    const record = await this.getById(record_id, user_id);
    record.isDeleted = action;
    return this.recordRepository.save(record);
  }
}