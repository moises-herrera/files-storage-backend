import {
  Body,
  Controller,
  Delete,
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
import { RenameFileDto } from 'src/storage/dtos/rename-file.dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req: ExtendedRequest,
    @Body() { folderId }: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileDto> {
    return this.fileService.upload(req.user.id, file, folderId);
  }

  @Patch(':fileId')
  renameFile(
    @Req() req: ExtendedRequest,
    @Param('fileId', ParseUUIDPipe) fileId: string,
    @Body() { name }: RenameFileDto,
  ): Promise<FileDto> {
    return this.fileService.rename(req.user.id, fileId, name);
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
