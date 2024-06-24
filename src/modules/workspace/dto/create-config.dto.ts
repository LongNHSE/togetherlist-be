import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateConfigDto {
  @IsBoolean()
  @IsNotEmpty()
  visibility: boolean;

  @IsBoolean()
  @IsNotEmpty()
  boardCreationRestrictions: boolean;

  @IsBoolean()
  @IsNotEmpty()
  sharingBoardRestrictions: boolean;
}
