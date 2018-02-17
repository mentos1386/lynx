import {
  Controller, Post, UseInterceptors,
  Req, UploadedFile,
} from '@nestjs/common';
import { IRequest } from '../../interfaces/request.interface';
import { STORAGE_TYPE } from '../core/storage/storage.constants';
import { StorageService } from '../core/storage/storage.service';
import { mixinStorageInterceptor } from '../core/storage/storage.interceptor.mixin';

@Controller()
export class DemoController {

  constructor(
    private storageService: StorageService,
  ) {
  }

  @Post('/upload')
  @UseInterceptors(mixinStorageInterceptor(
    () => 'file',
    () => STORAGE_TYPE.DISK,
  ))
  public async upload(
    @Req() req: IRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // file should have path/destination property if is written
    console.log('file uploaded', file);
    return file;
  }

}
