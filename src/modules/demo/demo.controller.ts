import {
  Controller, Post, UseInterceptors,
  Req, UploadedFile, Get, ForbiddenException, HttpException, InternalServerErrorException,
  BadRequestException, HttpStatus,
} from '@nestjs/common';
import { STORAGE_TYPE } from '../core/storage/storage.constants';
import { StorageService } from '../core/storage/storage.service';
import { StorageInterceptor } from '../core/storage/storage.interceptor.mixin';
import { LoggerService } from '../core/logger/logger.service';
import { UserBlockedException } from '../user/exceptions/userBlocked.exception';
import { RavenInterceptor } from 'nest-raven';

@Controller()
export class DemoController {

  constructor(
    private storageService: StorageService,
    private loggerService: LoggerService,
  ) {
  }

  @Get('/logger')
  public async logger(@Req() req) {
    this.loggerService.error('error');
    this.loggerService.warning('warning');
    this.loggerService.debug('debug');
    this.loggerService.info('info');
    this.loggerService.silly('silly');
  }

  @Get('/exception/custom')
  public async exceptionCustom() {
    throw new UserBlockedException();
  }

  @Get('/exception/sentry')
  public async exceptionSentry() {
    throw new HttpException('Should be cached by sentry', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @UseInterceptors(RavenInterceptor({
    filters: [
      { type: HttpException, filter: (exception: HttpException) => 500 > exception.getStatus() },
    ],
    tags: {
      tryingOut: 'ravenInterceptor',
    },
    level: 'warning',
  }))
  @Get('/exception/http')
  public async exceptionHttp() {
    throw new Error('some error');
    // throw new BadRequestException({ message: 'this should be', with: ['an', 'array'] });
  }

  @Post('/upload')
  @UseInterceptors(StorageInterceptor('file', STORAGE_TYPE.DISK))
  public async upload(
    @UploadedFile() file: Express.MulterS3.File,
  ) {
    // file should have path/destination property if is written
    console.log('file uploaded', file);

    return file;
    // return await this.storageService.save(file, STORAGE_TYPE.DISK);
  }

}
