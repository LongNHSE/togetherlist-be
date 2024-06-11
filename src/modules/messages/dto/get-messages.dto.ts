import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetMessageDto {
  @IsInt()
  @Type(() => Number)
  readonly roomId: number;
}
