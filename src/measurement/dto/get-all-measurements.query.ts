import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllMeasurementsQuery {
  @IsInt()
  @Type(() => Number)
  record_id: number
}