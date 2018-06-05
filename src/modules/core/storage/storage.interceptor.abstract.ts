import { NestInterceptor } from '@nestjs/common/interfaces/nest-interceptor.interface';
import { ExecutionContext } from '@nestjs/common/interfaces/execution-context.interface';
import { Observable } from 'rxjs/Observable';
import * as multer from 'multer';
import { BadRequestException, Inject, Interceptor } from '@nestjs/common';
import { STORAGE_TYPE } from './storage.constants';
import { STORAGE_DISK_PROVIDER } from './disk/disk.constants';
import { STORAGE_S3_PROVIDER } from './s3/s3.constants';
import { extension } from 'mime-types';
import { StorageEngine } from 'multer';
import { AbstractStorageEngine } from './storage.engine.abstract';

@Interceptor()
export abstract class AbstractStorageInterceptor implements NestInterceptor {

  protected abstract readonly provider: AbstractStorageEngine;
  protected abstract readonly fieldName: string;
  protected abstract readonly required: boolean;

  async intercept(
    request: any,
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Promise<Observable<any>> {

    const upload = multer({
      storage: this.provider.storageEngine,
    });

    const fileOrError = await new Promise((resolve, reject) =>
      upload.array(this.fieldName)(request, request.res, resolve),
    );

    if (fileOrError instanceof Error) {
      throw fileOrError;
    }

    if (this.required && !request.file) {
      throw new BadRequestException('File is missing', 'FILE_MISSING_EXCEPTION');
    }

    return stream$;
  }
}
