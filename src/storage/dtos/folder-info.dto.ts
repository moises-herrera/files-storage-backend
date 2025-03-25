import { FileDto } from './file.dto';

export class FolderInfoDto {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly subFolders: FolderInfoDto[];
  readonly files: FileDto[];
}
