import { Type, Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class PaginationParamsDto {
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
