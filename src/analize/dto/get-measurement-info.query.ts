import { IsISO8601, IsOptional } from 'class-validator';

export class GetMeasurementInfoQuery{
  @IsISO8601()
  @IsOptional()
  upperLimit: string | null
  @IsISO8601()
  @IsOptional()
  lowerLimit: string | null
}