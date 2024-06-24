import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsWorkspaceExist } from 'src/modules/workspace/validator/is-workspace-existed.validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsWorkspaceExist()
  workspace: string;

  @IsOptional()
  @IsArray()
  sections: string[];

  @IsOptional()
  @IsArray()
  taskStatus: string[];
}
