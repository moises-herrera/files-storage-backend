import { FolderItemPermissionDto } from './folder-item-permission.dto';

export class FolderRelatedDto {
  id: string;
  name: string;
  owner: string;
  permissions?: FolderItemPermissionDto[];
  parentFolder?: string | null;
}
