import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActivityBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  subcategoryId: number | null
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  time: number | null
  @IsString()
  @IsOptional()
  note: string | null
}