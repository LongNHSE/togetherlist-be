import { IsInt, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsValidObjectId } from 'src/common/validator/IsValidObjectId.validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsValidObjectId()
  roomChatId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  content: string;
}
