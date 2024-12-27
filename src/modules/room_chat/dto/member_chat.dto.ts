import { IsNotEmpty, IsUUID } from 'class-validator';
import { isValidObjectId, ObjectId } from 'mongoose';
import { IsValidObjectId } from 'src/common/validator/IsValidObjectId.validator';
import { IsUserExists } from 'src/modules/user/validator/is-user-exists.validator';

export class MemberChatDto {
  @IsNotEmpty()
  @IsValidObjectId()
  @IsUserExists()
  userId: string;
}
