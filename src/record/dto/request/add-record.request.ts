import { IsISO8601, IsOptional } from 'class-validator';

export class AddRecordRequest {
  @IsISO8601()
  date: string
  @IsOptional()
  note: string | null
}
