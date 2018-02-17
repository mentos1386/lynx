import { mixin } from '@nestjs/common';
import { StorageInterceptor } from './storage.interceptor.abstract';
import { STORAGE_TYPE } from './storage.constants';

export function mixinStorageInterceptor(fieldName: () => string, storageType?: () => STORAGE_TYPE) {
  return mixin(class extends StorageInterceptor {
    protected readonly fieldName = fieldName;
    protected readonly storageType = storageType;
  });
}
