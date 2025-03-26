import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetFolderContentDto {
  @IsOptional()
  folderId?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) =>
    isNaN(parseInt(value as string, 10)) ? 1 : parseInt(value as string, 10),
  )
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) =>
    isNaN(parseInt(value as string, 10)) ? 10 : parseInt(value as string, 10),
  )
  @Min(1)
  pageSize?: number;
}

export class GetOwnerFolderContentDto extends GetFolderContentDto {
  ownerId: string;
}
