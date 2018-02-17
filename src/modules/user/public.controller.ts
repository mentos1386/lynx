import {
  Body, Controller, Get, Headers, Post, Put, Query, UseInterceptors, FileInterceptor,
  Req, UploadedFile, Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  VLoginCredentials,
  VPasswordReset,
  VRegister,
  VRequestReset,
  VToken,
} from './user.validations';
import { DAuthenticatedUser, DUserProfile } from './user.dto';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { IRequest } from '../../interfaces/request.interface';
import { STORAGE_TYPE } from '../core/storage/storage.constants';
import { STORAGE_S3_PROVIDER } from '../core/storage/s3/s3.constants';
import { StorageEngine } from 'multer';
import { StorageService } from '../core/storage/storage.service';
import { StorageEntity } from '../core/storage/storage.entity';
import { STORAGE_DISK_PROVIDER } from '../core/storage/disk/disk.constants';

@Controller()
export class PublicUserController {

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    @Inject(STORAGE_S3_PROVIDER) private s3StorageProvider: StorageEngine,
    @Inject(STORAGE_DISK_PROVIDER) private diskStorageProvider: StorageEngine,
    private storageService: StorageService,
  ) {
  }

  @Post('/store')
  @UseInterceptors(FileInterceptor('file', { storage: this.diskStorageProvider }))
  public async changeProfileImage(
    @Req() req: IRequest,
    @UploadedFile() file: Express.MulterS3.File,
  ): Promise<StorageEntity> {
    console.log(this.diskStorageProvider);
    console.log('file uploaded', file);
    return await this.storageService.save(file, STORAGE_TYPE.DISK);
  }


  /* Authorization */

  @Post('/register')
  public async register(@Body() data: VRegister): Promise<DAuthenticatedUser> {
    const user = await this.userService.register(data);
    const token = this.authenticationService.sign(user.id);

    return new DAuthenticatedUser(user, token);
  }

  @Post('/login')
  public async login(@Body() credentials: VLoginCredentials): Promise<DAuthenticatedUser> {
    const user = await this.userService.login(credentials);
    const token = this.authenticationService.sign(user.id);

    return new DAuthenticatedUser(user, token);
  }

  /* Email confirmation and password reset */

  @Get('/verify')
  public async resendVerificationCode(@Query('email') email: string): Promise<{}> {
    await this.userService.resendVerificationEmail(email);
    return {};
  }

  @Post('/verify')
  public async verifyEmail(@Body() body: VToken): Promise<DUserProfile> {
    const user = await this.userService.verifyEmail(body.token);
    return new DUserProfile(user);
  }

  @Post('/reset')
  public async requestReset(@Body() body: VRequestReset): Promise<{ email: string }> {
    await this.userService.requestPasswordReset(body.email);
    return { email: body.email };
  }

  @Get('/reset')
  public async validateResetToken(@Query('token') token: string): Promise<{}> {
    await this.authenticationService.verify(token);
    return {};
  }

  @Put('/reset')
  public async resetPassword(@Body() data: VPasswordReset): Promise<DAuthenticatedUser> {
    const user = await this.userService.resetPassword(data);
    const token = this.authenticationService.sign(user.id);

    return new DAuthenticatedUser(user, token);
  }

  /* Check auth */

  @Get('/check_auth')
  public async checkAuth(@Headers('authorization') authorization: string): Promise<{}> {
    await this.authenticationService.verify(authorization);
    return {};
  }
}
