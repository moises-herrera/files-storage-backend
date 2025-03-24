import {
  Body,
  Controller,
  Delete,
  HttpStatus,
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
import { FileIdsDto } from '../dtos/file-ids.dto';
import { Response } from 'express';

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
    return this.fileService.upload(file, req.user.id, folderId);
  }

  @Delete()
  async deleteFiles(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Body() { fileIds }: FileIdsDto,
  ): Promise<void> {
    await this.fileService.deleteMany(fileIds, req.user.id);

    res.status(HttpStatus.OK).json({
      message: 'Files deleted successfully',
    });
  }
}
