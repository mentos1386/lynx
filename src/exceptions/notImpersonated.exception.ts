import { RequestException } from './request.exception';

export class NotImpersonatedException extends RequestException {
  code: number = 10;
  message: string = 'You do not impersonate anyone.';
}
