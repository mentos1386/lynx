import { RequestException } from '../../../exceptions/request.exception';

export class UnauthorizedException extends RequestException {
  code: number = 7;
  message: string = 'Unauthorized';
}
