import { Inject, mixin } from '@nestjs/common';
import { AbstractStorageEngine } from '../storage.engine.abstract';
import { STORAGE_DISK_PROVIDER } from './disk.constants';
import { StorageEngine } from 'multer';

// tslint:disable-next-line:function-name
export function DiskStorageEngine() {
  return mixin(class extends AbstractStorageEngine {
    constructor(@Inject(STORAGE_DISK_PROVIDER) protected provider: StorageEngine) {
      super();
    }
  });
}
