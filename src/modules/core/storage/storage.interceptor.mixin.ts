import { mixin } from '@nestjs/common';
import { AbstractStorageInterceptor } from './storage.interceptor.abstract';
import { STORAGE_TYPE } from './storage.constants';
import { AbstractStorageEngine } from './storage.engine.abstract';

// tslint:disable-next-line:function-name
export function StorageInterceptor(
  fieldName: string = 'file',
  provider?: AbstractStorageEngine,
  required?: boolean,
) {
  return mixin(class extends AbstractStorageInterceptor {
    protected readonly fieldName = fieldName;
    protected readonly provider = provider;
    protected readonly required = required;
  });
}
