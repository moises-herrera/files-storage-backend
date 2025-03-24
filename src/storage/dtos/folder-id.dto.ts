import { IsOptional, IsUUID } from 'class-validator';

export class FolderIdDto {
  @IsOptional()
  @IsUUID()
  folderId?: string;
}
