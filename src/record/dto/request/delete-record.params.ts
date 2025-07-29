import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteRecordParams {
  @IsInt()
  @Type(() => Number)
  id: number
}