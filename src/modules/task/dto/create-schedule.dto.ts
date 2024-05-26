import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsDate()
  from: Date;

  @IsNotEmpty()
  @IsDate()
  to: Date;
}
