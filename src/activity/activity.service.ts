import { Repository } from 'typeorm';
import { RecordPhysicalActivity } from '../models/record-physical-activity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { SubcategoryService } from './subcategory.service';
import { RecordService } from '../record/record.service';
import { UserService } from '../user/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AddActivityBody } from './dto/add-activity.body';
import { UpdateActivityBody } from './dto/update-activity.body';

export class ActivityService{
  constructor(
    @InjectRepository(RecordPhysicalActivity)
    private activityRepository: Repository<RecordPhysicalActivity>,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private recordService: RecordService,
    private userService: UserService
  ) {}

  async getAll(record_id: number, user_id: number): Promise<RecordPhysicalActivity[]>{
    const record = await this.recordService.getById(record_id, user_id);
    return this.activityRepository.find({
      where: {
        record: record
      },
      relations: ['subcategory', 'subcategory.category']
    })
  }

  async getById(id: number, user_id: number): Promise<RecordPhysicalActivity>{
    const user = await this.userService.getUserById(user_id);
    const activity = await this.activityRepository.findOne({
      where: {
        id: id
      },
      relations: ['subcategory', 'subcategory.category', 'record', 'record.user']
    })
    if(activity == null){
      throw new HttpException('This is no such record activity', HttpStatus.NOT_FOUND)
    }
    if(activity.record.user.id != user.id){
      throw new HttpException('This is not your record', HttpStatus.FORBIDDEN)
    }
    if(activity.record.isDeleted){
      throw new HttpException('You can not edit deleted record', HttpStatus.FORBIDDEN)
    }
    return activity
  }

  async add(body: AddActivityBody, user_id: number){
    const record = await this.recordService.getById(body.recordId, user_id)
    let activity = new RecordPhysicalActivity(
      record,
      await this.subcategoryService.getById(body.subcategoryId),
      body.time,
      body.note
    )
    activity = await this.activityRepository.save(activity)
    return this.getById(activity.id, user_id)
  }

  async update(body: UpdateActivityBody, user_id: number) {
    const activity = await this.getById(body.id, user_id)
    if (body.time == null) activity.time = body.time
    if (body.note == null) activity.note = body.note
    if (body.subcategoryId == null) activity.subcategory = await this.subcategoryService.getById(body.subcategoryId)
    return this.activityRepository.save(activity)
  }

  async delete(id: number, user_id: number){
    const activity = await this.getById(id, user_id)
    try {
      await this.activityRepository.remove(activity)
      return true
    }catch (e) {
      throw new HttpException('Something went wring', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }
}