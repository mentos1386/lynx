import {
  ExecutionContext, Inject, Interceptor,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import { RAVEN_SENTRY_PROVIDER } from './raven.constants';
import * as Raven from 'raven';
import 'rxjs/add/operator/do';

@Interceptor()
export abstract class AbstractRavenInterceptor implements NestInterceptor {

  protected abstract readonly exceptions: any[] = [];

  constructor(
    @Inject(RAVEN_SENTRY_PROVIDER) private ravenClient: Raven.Client,
  ) {
  }

  intercept(
    dataOrRequest: any,
    context: ExecutionContext,
    stream$: Observable<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // first param would be for events, second is for errors
    return stream$.do(null, (exception) => {

      const valid = !!this.exceptions.find(validException => exception instanceof validException);

      if (valid) {
        this.ravenClient.captureException(
          exception as any,
          {
            req: dataOrRequest,
            user: dataOrRequest.user,
          });
      }
    });
  }
}
