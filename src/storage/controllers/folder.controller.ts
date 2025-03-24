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
import { FolderIdDto } from 'src/storage/dtos/folder-id.dto';
import { CreateFolderDto } from 'src/storage/dtos/create-folder.dto';
import { FolderInfoDto } from 'src/storage/dtos/folder-info.dto';
import { FolderIdsDto } from 'src/storage/dtos/folder-ids.dto';
import { Response } from 'express';
import { FolderDto } from 'src/storage/dtos/folder.dto';
import { UpdateFolderDto } from 'src/storage/dtos/update-folder.dto';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  getFolderById(
    @Req() req: ExtendedRequest,
    @Query() { folderId }: FolderIdDto,
  ): Promise<FolderInfoDto> {
    return this.folderService.getFolderContent(req.user.id, folderId);
  }

  @Post()
  createFolder(
    @Req() req: ExtendedRequest,
    @Body() { name, parentFolderId }: CreateFolderDto,
  ): Promise<FolderDto> {
    return this.folderService.create(name, req.user.id, parentFolderId);
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
