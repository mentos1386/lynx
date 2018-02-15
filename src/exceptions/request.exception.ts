export class RequestException extends Error {
  message: string = 'Unknown error';
  code: number = 0;
  data: any = {};
}
