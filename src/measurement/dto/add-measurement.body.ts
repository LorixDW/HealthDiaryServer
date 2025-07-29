import { IsInt, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class Time {
  @IsInt()
  @Type(() => Number)
  hours: number
  @IsInt()
  @Type(() => Number)
  minutes: number
}

export class AddMeasurementBody{
  @IsInt()
  @Type(() => Number)
  recordId: number
  @IsObject()
  time: Time
}

