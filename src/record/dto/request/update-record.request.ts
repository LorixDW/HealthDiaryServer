import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRecordRequest {
  @IsInt()
  @Type(() => Number)
  id: number
  @IsOptional()
  note: string | null
}