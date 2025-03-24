import { IsUUID } from 'class-validator';

export class FileIdsDto {
  @IsUUID(4, { each: true })
  fileIds: string[];
}
