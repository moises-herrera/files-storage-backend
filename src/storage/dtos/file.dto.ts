export class FileDto {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly size: number;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly owner: string;
  readonly folder: string;
}
