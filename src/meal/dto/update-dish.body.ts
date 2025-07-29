import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDishBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  value: number
}