import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly title: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly description: string;
}
