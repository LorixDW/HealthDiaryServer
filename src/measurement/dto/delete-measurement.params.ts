import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteMeasurementParams{
  @IsInt()
  @Type(() => Number)
  id: number
}