import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModule,
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { fileLoader } from 'ejs';
import fs from 'fs';
import { diskStorage } from 'multer';
import createCloudinaryStorage, {
  CloudinaryStorage,
} from 'multer-storage-cloudinary';
import path, { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  }
  getRootPath = () => {
    return process.cwd();
  };
  // ensureExists(targetDirectory: string) {
  //   fs.mkdir(targetDirectory, { recursive: true }, (error) => {
  //     if (!error) {
  //       console.log('Directory successfully created, or it already exist');
  //       return;
  //     }
  //     switch (error.code) {
  //       case 'EEXIST':
  //         //Error
  //         //Requested location already exists, but it's not a ...
  //         break;
  //       case 'ENOTDIR':
  //         //Error:
  //         //the parent hierarchy contains a file with the same name as the
  //         //you're truying to create
  //         break;
  //       default:
  //         //some other error like permission denied
  //         console.log(error);
  //         break;
  //     }
  //   });
  // }

  // createMulterOptions(): MulterModuleOptions {
  //   return {
  //     storage: diskStorage({
  //       destination: (req, file, cb) => {
  //         const folder = req?.headers?.folder_type ?? 'default';
  //         this.ensureExists(`public/images/${folder}`);
  //         cb(null, join(this.getRootPath(), `public/images/${folder}`));
  //       },
  //       filename: (req, file, cb) => {
  //         let extName = path.extname(file.originalname);
  //         let baseName = path.basename(file.originalname);
  //         let finalName = `${baseName}-${Date.now()}${extName}`;
  //         cb(null, finalName);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       const allowedFileTypes = [
  //         'jpg',
  //         'jpeg',
  //         'png',
  //         'gif',
  //         'pdf',
  //         'doc',
  //         'docx',
  //       ];
  //       const fileExtension = file.originalname
  //         .split('.')
  //         .pop()
  //         .toLocaleLowerCase();
  //       const isValidFileType = allowedFileTypes.includes(fileExtension);

  //       if (!isValidFileType) {
  //         cb(
  //           new HttpException(
  //             'Invalid file type',
  //             HttpStatus.UNPROCESSABLE_ENTITY,
  //           ),
  //           null,
  //         );
  //       } else {
  //         cb(null, true);
  //       }
  //     },
  //     limits: {
  //       fileSize: 1024 * 1024 * 1, //1mb
  //     },
  //   };
  // }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
          // We'll use the folder parameter for the base folder
          folder: 'images',
          // This function determines the public_id (filename without extension)
          public_id: (req, file): string => {
            // Get the folder type from headers
            const folderType =
              (req.headers?.folder_type as string) || 'default';
            // Get base filename without extension
            const baseName = path.basename(
              file.originalname,
              path.extname(file.originalname),
            );
            // Return a path that includes the subfolder and filename
            return `${folderType}/${baseName}-${Date.now()}`;
          },
          // Use auto to detect and maintain the original file type
          resource_type: 'auto',
        } as any, // Use type assertion to bypass strict typing issues
      }),
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'pdf',
          'doc',
          'docx',
        ];
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        const isValidFileType = allowedFileTypes.includes(fileExtension);

        if (!isValidFileType) {
          cb(
            new HttpException(
              'Invalid file type',
              HttpStatus.UNPROCESSABLE_ENTITY,
            ),
            null,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 1MB
      },
    };
  }
}
