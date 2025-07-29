import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class AddDishBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  meal_id: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  serving_id: number
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  value: number
}