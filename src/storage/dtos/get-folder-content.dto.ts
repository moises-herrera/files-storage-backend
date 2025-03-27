import { IsOptional } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dtos/pagination-params.dto';

export class GetFolderContentDto extends PaginationParamsDto {
  @IsOptional()
  folderId?: string;

  @IsOptional()
  search?: string;
}

export class GetOwnerFolderContentDto extends GetFolderContentDto {
  ownerId: string;
}
