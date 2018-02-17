import { NestInterceptor } from '@nestjs/common/interfaces/nest-interceptor.interface';
import { ExecutionContext } from '@nestjs/common/interfaces/execution-context.interface';
import { Observable } from 'rxjs/Observable';
import * as multer from 'multer';
import { Inject, Interceptor } from '@nestjs/common';
import { STORAGE_TYPE } from './storage.constants';
import { STORAGE_DISK_PROVIDER } from './disk/disk.constants';
import { STORAGE_S3_PROVIDER } from './s3/s3.constants';

@Interceptor()
export abstract class StorageInterceptor implements NestInterceptor {

  protected abstract readonly storageType: () => STORAGE_TYPE;
  protected abstract readonly fieldName: () => string;

  constructor(
    @Inject(STORAGE_S3_PROVIDER) private storageS3Provider: multer.StorageEngine,
    @Inject(STORAGE_DISK_PROVIDER) private storageDiskProvider: multer.StorageEngine,
  ) {
  }

  async intercept(
    request: any,
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Promise<Observable<any>> {

    const upload = multer({
      storage: this.createStorage(),
    });

    await new Promise((resolve, reject) =>
      upload.single(this.fieldName())(request, request.res, resolve),
    );

    return stream$;
  }

  private createStorage(): multer.StorageEngine {
    switch (this.storageType()) {
      case STORAGE_TYPE.AWS_S3:
        return this.storageS3Provider;
      case STORAGE_TYPE.DISK:
        return this.storageDiskProvider;
    }
  }
}
