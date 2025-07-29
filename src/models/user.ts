import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Gender } from './gender';
import { Record } from './record';
import { Notification } from './notification';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint'
  })
  id: number;

  @Column({type: 'text'})
  login: string;

  @Column({type: 'text', nullable: true})
  email: string | null;

  @Column({type: 'text', nullable: true})
  phone: string | null;

  @Column({type: 'text'})
  password: string;

  @Column({type: 'real', nullable: true})
  height: number | null;

  @Column({type: 'real', nullable: true})
  weight: number | null

  @Column({type: "date", nullable: true})
  dob: Date | null;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender: Gender | null;

  @OneToMany(
    () => Record,
    (record) => record.user
  )
  records: Record[]

  @OneToMany(
    () => Notification,
    (notification) => notification.user)
  notifications: Notification[]

  constructor(
    login: string,
    password: string
  ) {
    this.login = login;
    this.password = password;
  }

  public toResponse(): UserResponse{
    const response = new UserResponse();
    response.login = this.login;
    response.email = this.email;
    response.phone = this.phone;
    response.dob = this.dob?.toLocaleString();
    response.gender = this.gender;
    response.height = this.height;
    return response;
  }

  public getAge(): number | null{
    if(!this.dob) return null
    const now = new Date(Date.now())
    return now.getFullYear() - new Date(this.dob).getFullYear()
  }
}

export class UserResponse{
  login: string;
  email: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  height: number | null;
}