import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('fileUpload'))
  // @UseFilters(new HttpExceptionFilter())
  // uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType:
  //           /^(image\/jpeg|image\/png|image\/gif|text\/plain|application\/pdf|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/i,
  //       })
  //       .addMaxSizeValidator({
  //         maxSize: 1024 * 1024, // 1024 * 1024 byte -> 1 mb
  //       })
  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return {
  //     fileName: file.filename,
  //   };
  // }
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file) {
    return {
      url: file.path,
      publicId: file.filename,
    };
  }
}
