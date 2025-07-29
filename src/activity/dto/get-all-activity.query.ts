import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllActivityQuery {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  record_id: number
}