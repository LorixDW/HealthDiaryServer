import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDishListQuery{
  @IsString()
  @IsNotEmpty()
  expression: string
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  max_results: number | null
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page_number: number | null
}