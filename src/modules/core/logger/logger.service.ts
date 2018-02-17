import { LoggerInstance } from 'winston';
import { Inject } from '@nestjs/common';
import { LOGGER_WINSTON_PROVIDER } from './logger.constants';

export class LoggerService {

  constructor(@Inject(LOGGER_WINSTON_PROVIDER) private winston: LoggerInstance) {
  }

  public debug(msg: string, ...meta): void {
    this.winston.debug(msg, ...meta);
  }

  public log(level: string, msg: string, ...meta): void {
    this.winston.log(level, msg, ...meta);
  }

  public error(msg: string, ...meta): void {
    this.winston.error(msg, ...meta);
  }

  public warning(msg: string, ...meta): void {
    this.winston.warn(msg, ...meta);
  }

  public info(msg: string, ...meta): void {
    this.winston.info(msg, ...meta);
  }

  public silly(msg: string, ...meta): void {
    this.winston.silly(msg, ...meta);
  }

}
