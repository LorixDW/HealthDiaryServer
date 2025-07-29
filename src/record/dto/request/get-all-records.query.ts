import { IsIn, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllRecordsQuery{
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  year: number
  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  @Type(() => Number)
  month: number
}