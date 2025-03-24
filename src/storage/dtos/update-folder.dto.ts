import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFolderDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
