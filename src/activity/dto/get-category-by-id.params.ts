import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCategoryByIdParams{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number
}