import { FolderPermissionDto } from './folder-permission.dto';

export class FolderDto {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly parentFolder?: string | null;
  readonly subFolders?: FolderDto[];
  readonly files: string[];
  readonly permissions: FolderPermissionDto[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
