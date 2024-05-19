import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsUserExists } from 'src/modules/user/validator/is-user-exists.validator';

export class NestedCreateMemberDto {
  @IsString()
  @IsUserExists()
  @IsNotEmpty()
  memberId: string;

  @Exclude()
  workspaceId: string;

  @IsNotEmpty()
  role: string;

  @Exclude()
  status: string;
}
