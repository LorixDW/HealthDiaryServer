import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './notification';

@Entity()
export class BindingType{
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'text'})
  name: string

  @OneToMany(
    () => Notification,
    (notification) => notification.type
  )
  notifications: Notification

  public toResponse(): BindingTypeResponse{
    const response = new BindingTypeResponse()
    response.id = this.id
    response.name = this.name
    return response
  }
}

export class BindingTypeResponse{
  id: number
  name: string
}