import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { NestedCreateMemberDto } from './nested-create-member.dto';

export class CreateMemberDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NestedCreateMemberDto)
  members: NestedCreateMemberDto[];
}
