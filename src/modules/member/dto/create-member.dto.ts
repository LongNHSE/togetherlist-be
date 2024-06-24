import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { NestedCreateMemberDto } from './nested-create-member.dto';

export class CreateMemberDto {
  @IsString()
  @ValidateNested({ each: true })
  @Type(() => NestedCreateMemberDto)
  members: NestedCreateMemberDto[];
}
