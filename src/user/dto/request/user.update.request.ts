import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class UserUpdateRequest {
  @IsEmail()
  @IsOptional()
  email: string | null;

  @IsPhoneNumber('RU')
  @IsOptional()
  phone: string | null;

  @IsNumber()
  @IsOptional()
  height: number | null;

  @IsEnum(['male', 'female'])
  @IsOptional()
  gender: 'male' | 'female' | null;

  @IsISO8601()
  @IsOptional()
  dob: string | null;
}