import { IsOptional } from 'class-validator';

export class FolderIdDto {
  @IsOptional()
  folderId?: string;
}
