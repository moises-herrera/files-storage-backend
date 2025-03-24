import { IsUUID } from 'class-validator';

export class FolderIdsDto {
  @IsUUID(4, { each: true })
  folderIds: string[];
}
