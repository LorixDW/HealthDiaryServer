import { IsDateString, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive } from 'class-validator';
import { Time } from '../../measurement/dto/add-measurement.body';
import { Type } from 'class-transformer';

export class UpdateNotificationBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number
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