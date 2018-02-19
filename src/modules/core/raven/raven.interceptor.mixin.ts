import { mixin } from '@nestjs/common';
import { AbstractRavenInterceptor } from './raven.interceptor.abstract';

// tslint:disable-next-line:function-name
export function RavenInterceptor(
  ...exceptions: any[],
) {
  return mixin(class extends AbstractRavenInterceptor {
    protected readonly exceptions = exceptions;
  });
}
