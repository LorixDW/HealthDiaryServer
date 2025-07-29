import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AddActivityBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  recordId: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  subcategoryId: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  time: number
  @IsString()
  @IsOptional()
  note: string | null
}