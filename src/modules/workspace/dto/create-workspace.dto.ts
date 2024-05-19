import { Exclude, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateConfigDto } from './create-config.dto';
import { IsUserExists } from 'src/modules/user/validator/is-user-exists.validator';

export class CreateWorkspaceDto {
  @Exclude()
  owner: string;

  @ValidateNested()
  @Type(() => CreateConfigDto)
  config: CreateConfigDto;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  banner: string;

  @IsString()
  description: string;

  @IsString()
  status: string;
}
