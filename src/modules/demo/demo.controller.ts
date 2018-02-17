import {
  Controller, Post, UseInterceptors, FileInterceptor,
  Req, UploadedFile, Inject,
} from '@nestjs/common';
import { IRequest } from '../../interfaces/request.interface';
import { STORAGE_TYPE } from '../core/storage/storage.constants';
import { STORAGE_S3_PROVIDER } from '../core/storage/s3/s3.constants';
import { StorageEngine } from 'multer';
import { StorageService } from '../core/storage/storage.service';
import { StorageEntity } from '../core/storage/storage.entity';
import { STORAGE_DISK_PROVIDER } from '../core/storage/disk/disk.constants';

@Controller()
export class DemoController {

  constructor(
    @Inject(STORAGE_S3_PROVIDER) private s3StorageProvider: StorageEngine,
    @Inject(STORAGE_DISK_PROVIDER) private diskStorageProvider: StorageEngine,
    private storageService: StorageService,
  ) {
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', { storage: this.diskStorageProvider }))
  public async upload(
    @Req() req: IRequest,
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<StorageEntity> {
    console.log(this.diskStorageProvider);
    console.log('file uploaded', file);
    return await this.storageService.save(file, STORAGE_TYPE.DISK);
  }

}
