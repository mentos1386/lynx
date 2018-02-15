import { RequestException } from './request.exception';

export class NotFoundException extends RequestException {
  // FIXME: Should be moved to .constants file!
  static errorCodes: any = {
    user: 3,
    file: 4,
  };

  constructor(private object: string = null) {
    super();
    this.message = object + ' not found';
    this.code = NotFoundException.errorCodes[object] ? NotFoundException.errorCodes[object] : 2;
  }
}
