import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { BindingType, BindingTypeResponse } from './binding-type';
import { Time } from '../meal/dto/add-meal.body';

@Entity()
export class Notification{
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number

  @Column({type: 'text'})
  title: string

  @Column({type: 'text', nullable: true})
  description: string | null

  @Column({type: 'time'})
  time: Date | string

  @Column({type: 'smallint', nullable: true})
  dayOfWeek: number | null

  @Column({type: 'date', nullable: true})
  date: Date | string | null

  @ManyToOne(
    () => User,
    (user: User) => user.notifications
  )
  user: User

  @ManyToOne(
    () => BindingType,
    (type) => type.notifications
  )
  type: BindingType

  public toResponse(): NotificationResponse{
    const response = new NotificationResponse()
    response.id = Number(this.id)
    response.title = this.title
    response.description = this.description
    const [hours, minutes, seconds] = (this.time as String).split(':').map(Number);
    response.time = new Time();
    response.time.hours = hours;
    response.time.minutes = minutes;
    response.dayOfWeek = this.dayOfWeek
    response.date = this.date as string
    response.type = this.type.toResponse()
    return response
  }
}

export class NotificationResponse{
  id: number
  title: string
  description: string | null
  time: Time
  dayOfWeek: number | null
  date: string | null
  type: BindingTypeResponse
}