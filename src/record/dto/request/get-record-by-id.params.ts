import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecordByIdParams {
  @IsNumber()
  @Type(() => Number)
  id: number
}