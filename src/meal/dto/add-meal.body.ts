import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class Time{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  hours: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  minutes: number
}

export class AddMealBody{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  record_id: number
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  type_id: number | null
  @IsOptional()
  time: Time | null
  @IsString()
  @IsOptional()
  note: string | null
}

