import { IsNotEmpty } from 'class-validator';

export class AuthRequest {
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  password: string;
}