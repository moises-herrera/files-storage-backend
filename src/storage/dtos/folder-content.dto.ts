import { FolderItemDto } from './folder-item.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { FolderRelatedDto } from './folder-related.dto';

export class FolderContentDto {
  folders: FolderRelatedDto[];
  items: PaginatedResponseDto<FolderItemDto>;
}
