import { PermissionDto } from './permission.dto';

export class FolderPermissionDto {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly folder: string;
  readonly user: string;
  readonly permission: PermissionDto;
}
