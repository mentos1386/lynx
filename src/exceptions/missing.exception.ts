import { RequestException } from './request.exception';

export class MissingException extends RequestException {
  code: number = 11;

  constructor(private object: string = null) {
    super();
    this.message = this.object + ' missing';
  }
}
