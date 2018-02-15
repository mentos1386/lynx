import { RequestException } from '../../../exceptions/request.exception';

export class LastAdminException extends RequestException {
  code: number = 13;
  message: string = 'Cannot delete last admin';
}
