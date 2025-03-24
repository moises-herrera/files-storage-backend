import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  folderName: string;

  @IsOptional()
  @IsString()
  parentFolderId?: string;
}
