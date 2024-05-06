import { IsNotEmpty, IsString, IsEmail, IsDateString } from 'class-validator';

export class AuthDTO {
  _id: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  avatar: string;

  status: string;

  phone: string;

  role: string;

  refreshToken: string;
}