import { FileDto } from './file.dto';
import { FolderPermissionDto } from './folder-permission.dto';

export class FolderInfoDto {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly parentFolder?: string | null;
  readonly subFolders?: FolderInfoDto[];
  readonly files: FileDto[];
  readonly permissions: FolderPermissionDto[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
