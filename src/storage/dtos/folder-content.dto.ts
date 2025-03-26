import { FolderItemDto } from './folder-item.dto';
import { FolderItemPermissionDto } from './folder-item-permission.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

export class FolderContentDto {
  folders: {
    id: string;
    name: string;
    owner: string;
    permissions?: FolderItemPermissionDto[];
    parentFolder?: string | null;
  }[];
  items: PaginatedResponseDto<FolderItemDto>;
}
