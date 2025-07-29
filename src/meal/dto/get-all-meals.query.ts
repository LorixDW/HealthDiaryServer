import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllMealsQuery{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  record_id: number
}