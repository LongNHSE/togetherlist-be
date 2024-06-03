import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardStatusDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  color: string;
}
