import { Response } from 'express';
import { Middleware, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import { FileService } from '../modules/file/file.service';
import { File } from '../modules/file/file.entity';
import { MissingException } from '../exceptions/missing.exception';

@Middleware()
export class UploadMiddleware implements NestMiddleware {

  constructor(private fileService: FileService) {
  }

  resolve(options: { single: any, fields: any }): any {

    return async (req: any, res: Response, next: Function) => {

      const instance = multer({
        storage: multer.diskStorage({
          destination: (_req, _file, cb) => cb(null, FileService.uploadsPath),
          filename: (_req, _file, cb) => cb(
            null,
            File.createFilename(path.extname(_file.originalname))),
        }),
      });


      await new Promise((resolve) => {
        if (options && options.single) {
          instance.single(options.single)(req, res, err => resolve(err));
        } else {
          if (options && options.fields)
            instance.fields(options.fields)(req, res, err => resolve(err));
          else
            instance.any()(req, res, err => resolve(err));
        }
      });

      // Save file object to db
      if (options && options.single) {
        req.file = await this.fileService.saveUploadedFile(req.file);
      } else {
        if (req.files.length === 0) {
          throw new MissingException('file');
        }

        req.files = Promise.all(req.files.map(async file => await this.fileService.saveUploadedFile(
          file)));
      }
      next();
    };
  }
}
