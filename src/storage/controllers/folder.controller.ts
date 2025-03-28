import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { FolderService } from 'src/storage/services/folder.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { GetFolderContentDto } from 'src/storage/dtos/get-folder-content.dto';
import { CreateFolderDto } from 'src/storage/dtos/create-folder.dto';
import { FolderContentDto } from 'src/storage/dtos/folder-content.dto';
import { FolderIdsDto } from 'src/storage/dtos/folder-ids.dto';
import { Response } from 'express';
import { FolderDto } from 'src/storage/dtos/folder.dto';
import { UpdateFolderDto } from 'src/storage/dtos/update-folder.dto';
import { FolderRelatedDto } from 'src/storage/dtos/folder-related.dto';
import { PaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { StorageService } from 'src/storage/services/storage.service';
import * as archiver from 'archiver';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(
    private readonly folderService: FolderService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  createFolder(
    @Req() req: ExtendedRequest,
    @Body() { name, parentFolderId }: CreateFolderDto,
  ): Promise<FolderDto> {
    return this.folderService.create(name, req.user.id, parentFolderId);
  }

  @Get('owner-content')
  getOwnerFolderContent(
    @Req() req: ExtendedRequest,
    @Query() getFolderContentDto: GetFolderContentDto,
  ): Promise<FolderContentDto> {
    return this.folderService.getOwnerFolderContent({
      ownerId: req.user.id,
      ...getFolderContentDto,
    });
  }

  @Get('recent')
  getRecentFolders(
    @Req() req: ExtendedRequest,
    @Query() paginationParamsDto: PaginationParamsDto,
  ): Promise<FolderRelatedDto[]> {
    return this.folderService.getRecentFolders(
      req.user.id,
      paginationParamsDto,
    );
  }

  @Get(':id/download')
  async downloadFolder(
    @Req() req: ExtendedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    try {
      const filesToZip = await this.folderService.getFolderFiles(
        id,
        req.user.id,
      );

      if (filesToZip.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'No files found in the folder',
        });
      }

      const mainFolderName = filesToZip[0].relativePath.split('/')[0];

      res.header('Content-Type', 'application/zip');
      res.header(
        'Content-Disposition',
        `attachment; filename=${mainFolderName}.zip`,
      );

      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      archive.on('error', (err) => {
        throw err;
      });
      archive.pipe(res);

      for (const file of filesToZip) {
        const fileSignedUrl = await this.storageService.getFileUrl(
          file.storagePath,
        );
        const fileDownloaded = await fetch(fileSignedUrl);
        const fileArrayBuffer = await fileDownloaded.arrayBuffer();
        const fileBuffer = Buffer.from(fileArrayBuffer);
        archive.append(fileBuffer, {
          name: file.relativePath,
        });
      }

      await archive.finalize();
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error downloading folder',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  @Patch(':id')
  updateFolder(
    @Req() req: ExtendedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { name }: UpdateFolderDto,
  ): Promise<FolderDto> {
    return this.folderService.update(id, name, req.user.id);
  }

  @Delete()
  async deleteFolders(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Body() { folderIds }: FolderIdsDto,
  ) {
    await this.folderService.deleteMany(req.user.id, folderIds);

    res.status(HttpStatus.OK).json({
      message: 'Folders deleted successfully',
    });
  }
}
