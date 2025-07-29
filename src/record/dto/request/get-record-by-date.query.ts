import { IsISO8601 } from 'class-validator';

export class GetRecordByDateQuery {
  @IsISO8601()
  date: string
}