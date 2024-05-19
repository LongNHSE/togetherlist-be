import { IsArray, IsNotEmpty } from 'class-validator';
import { IsUserExists } from 'src/modules/user/validator/is-user-exists.validator';

export class MemberDto {
  @IsArray()
  @IsUserExists({ each: true })
  @IsNotEmpty()
  memberId: string[];
}
