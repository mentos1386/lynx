import { Logger, LoggerInstance, transports } from 'winston';

export class LoggerService {

  private readonly LOG_LEVEL = process.env.LOG_LEVEL;
  private readonly transports = [
    new transports.Console({
      colorize: true,
      align: true,
    }),
  ];

  private winston: LoggerInstance;

  constructor() {
    this.winston = new Logger({
      level: this.LOG_LEVEL,
      transports: this.transports,
    });
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
