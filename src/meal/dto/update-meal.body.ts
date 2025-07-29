import { Time } from './add-meal.body';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMealBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number
  @IsOptional()
  time: Time | null
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  type_id: number | null
  @IsNotEmpty()
  @IsOptional()
  note: string | null
}