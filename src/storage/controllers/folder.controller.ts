import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { FolderService } from 'src/storage/services/folder.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { FolderIdDto } from 'src/storage/dtos/folder-id.dto';
import { CreateFolderDto } from 'src/storage/dtos/create-folder.dto';
import { FolderDto } from 'src/storage/dtos/folder.dto';
import { FolderIdsDto } from 'src/storage/dtos/folder-ids.dto';
import { Response } from 'express';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  getFolderById(
    @Req() req: ExtendedRequest,
    @Query() { folderId }: FolderIdDto,
  ): Promise<FolderDto> {
    return this.folderService.getById(req.user.id, folderId);
  }

  @Post()
  createFolder(
    @Req() req: ExtendedRequest,
    @Body() { folderName, parentFolderId }: CreateFolderDto,
  ) {
    return this.folderService.create(folderName, req.user.id, parentFolderId);
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
