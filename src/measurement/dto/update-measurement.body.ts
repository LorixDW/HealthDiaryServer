import { Time } from './add-measurement.body';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class Indicator {
  @IsInt()
  @Type(() => Number)
  id: number
  @IsNotEmpty()
  name: string
}

export class MeasurementIndicator{
  @IsInt()
  @Type(() => Number)
  id: number
  @IsObject()
  indicator: Indicator
  @IsNumber()
  @Type(() => Number)
  value: number
}

export class UpdateMeasurementBody {
  @IsInt()
  @Type(() => Number)
  id: number
  @IsObject()
  time: Time
  @IsArray()
  measurementsIndicators: MeasurementIndicator[]
}