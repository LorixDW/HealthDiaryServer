import { Time } from '../../measurement/dto/add-measurement.body';
import { IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AddNotificationBody{
  @IsNotEmpty()
  title: string
  @IsNotEmpty()
  @IsOptional()
  description: string | null
  @IsObject()
  time: Time
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  dayOfWeek: number | null
  @IsDateString()
  @IsOptional()
  date: string | null
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  type: number
}