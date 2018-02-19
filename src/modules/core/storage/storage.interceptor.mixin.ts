import { mixin } from '@nestjs/common';
import { AbstractStorageInterceptor } from './storage.interceptor.abstract';
import { STORAGE_TYPE } from './storage.constants';

// tslint:disable-next-line:function-name
export function StorageInterceptor(
  fieldName: string = 'file',
  storageType?: STORAGE_TYPE,
  required: boolean = true,
) {
  return mixin(class extends AbstractStorageInterceptor {
    protected readonly fieldName = fieldName;
    protected readonly storageType = storageType;
    protected readonly required = required;
  });
}
