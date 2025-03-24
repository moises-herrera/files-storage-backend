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
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { FileService } from 'src/storage/services/file.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { UploadFileDto } from 'src/storage/dtos/upload-file.dto';
import { FileDto } from 'src/storage/dtos/file.dto';
import { FileIdsDto } from 'src/storage/dtos/file-ids.dto';
import { Response } from 'express';
import { UpdateFileDto } from 'src/storage/dtos/update-file.dto';
import { FileUrlDto } from 'src/storage/dtos/file-url.dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req: ExtendedRequest,
    @Body() { folderId }: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    return this.fileService.upload(req.user.id, file, folderId);
  }

  @Get(':fileId')
  getFile(
    @Req() req: ExtendedRequest,
    @Param('fileId', ParseUUIDPipe) fileId: string,
  ): Promise<FileUrlDto> {
    return this.fileService.getUrl(req.user.id, fileId);
  }

  @Patch(':fileId')
  updateFile(
    @Req() req: ExtendedRequest,
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileDto> {
    return this.fileService.update(req.user.id, fileId, updateFileDto);
  }

  @Delete()
  async deleteFiles(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Body() { fileIds }: FileIdsDto,
  ): Promise<void> {
    await this.fileService.deleteMany(req.user.id, fileIds);

    res.status(HttpStatus.OK).json({
      message: 'Files deleted successfully',
    });
  }
}
