import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../models/notification';
import { Repository } from 'typeorm';
import { BindingType } from '../models/binding-type';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { not } from 'rxjs/internal/util/not';
import { AddNotificationBody } from './dto/add-notification.body';
import { UpdateNotificationBody } from './dto/update-notification.body';
import { normalizePath } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class NotificationService{
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(BindingType)
    private typeRepository: Repository<BindingType>,
    private userService: UserService
  ) {}

  async getTypeAll(): Promise<BindingType[]>{
    return this.typeRepository.find()
  }

  async getTypeById(id: number): Promise<BindingType>{
    const type = await this.typeRepository.findOne({
      where: {
        id: id
      }
    })
    if(type == null){
      throw new HttpException(`There is no notification binding type with id ${id}`, HttpStatus.NOT_FOUND)
    }
    return type
  }

  async getAll(user_id: number){
    await this.userService.getUserById(user_id)
    return this.notificationRepository.find({
      where: {
        user: {
          id: user_id
        }
      },
      relations: ['user', 'type']
    })
  }

  async getById(id: number, user_id: number): Promise<Notification>{
    await this.userService.getUserById(user_id)
    const notification = await this.notificationRepository.findOne({
      where: {
        id: id
      },
      relations: ['user', 'type']
    })
    if(notification == null){
      throw new HttpException(`There is no notification with id ${id}`, HttpStatus.NOT_FOUND)
    }
    if(notification.user.id != user_id){
      throw new HttpException('This notification is not yours', HttpStatus.FORBIDDEN)
    }
    return notification
  }

  async add(body: AddNotificationBody, user_id: number): Promise<Notification>{
    const user = await this.userService.getUserById(user_id)
    let notification = new Notification()
    notification.user = user
    notification.type = await this.getTypeById(body.type)
    notification.title = body.title
    notification.description = body.description
    notification.time = new Date(0, 0, 0, body.time.hours, body.time.minutes)
    notification.dayOfWeek = body.dayOfWeek
    notification.date = body.date ? new Date(body.date) : null
    notification =  await this.notificationRepository.save(notification)
    return this.getById(notification.id, user_id)
  }

  async update(body: UpdateNotificationBody, user_id: number): Promise<Notification>{
    let notification = await this.getById(body.id, user_id)
    notification.type = await this.getTypeById(body.type)
    notification.title = body.title
    notification.description = body.description
    notification.time = new Date(0, 0, 0, body.time.hours, body.time.minutes)
    notification.dayOfWeek = body.dayOfWeek
    notification.date = body.date ? new Date(body.date) : null
    notification =  await this.notificationRepository.save(notification)
    return this.getById(notification.id, user_id)
  }

  async delete(id: number, user_id: number): Promise<boolean>{
    const notification = await this.getById(id, user_id)
    try{
      await this.notificationRepository.remove(notification)
      return true
    }catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.SERVICE_UNAVAILABLE)
    }
  }
}