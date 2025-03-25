import { PaginationMetadataDto } from 'src/common/dtos/pagination-metadata.dto';
import { FolderItemDto } from './folder-item.dto';
import { FolderItemPermissionDto } from './folder-permission.dto';

export class FolderContentDto {
  readonly folder: {
    readonly id: string;
    readonly name: string;
    readonly owner: string;
    readonly permissions: FolderItemPermissionDto[];
    readonly parentFolder?: {
      readonly id: string;
      readonly name: string;
    } | null;
  };
  readonly items: {
    data: FolderItemDto[];
    pagination: PaginationMetadataDto;
  };
}
