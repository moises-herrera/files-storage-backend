import { PaginationMetadataDto } from './pagination-metadata.dto';

export class PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationMetadataDto;
}
