import {
  Body, Controller, Delete, Get, Inject, Post, Put, UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { VChangeUserRole, VProfile, VUpdatePassword } from './user.validations';
import { UserRoles } from './guards/roles.decorator';
import { DAuthenticatedUser, DUserProfile } from './user.dto';
import { USER_ROLE } from './user.constants';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { STORAGE_S3_PROVIDER } from '../core/storage/s3/s3.constants';
import { StorageEngine } from 'multer';
import { StorageService } from '../core/storage/storage.service';
import { STORAGE_TYPE } from '../core/storage/storage.constants';
import { StorageInterceptor } from '../core/storage/storage.interceptor.mixin';
import {
  AuthenticatedUser,
  ImpersonatedById,
} from '../core/authentication/authentication.decorators';
import { User } from './user.entity';

@Controller()
@UserRoles(USER_ROLE.DEFAULT, USER_ROLE.ADMIN)
export class UserUserController {

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    @Inject(STORAGE_S3_PROVIDER) private s3StorageProvider: StorageEngine,
    private storageService: StorageService,
  ) {
  }

  @Get()
  public async getMe(
    @AuthenticatedUser() authenticatedUser: User,
  ): Promise<DUserProfile> {
    return new DUserProfile(authenticatedUser);
  }

  @Delete()
  public async deleteMe(
    @AuthenticatedUser() authenticatedUser: User,
  ): Promise<{}> {
    await this.userService.remove(authenticatedUser.id);
    return {};
  }

  @Put()
  public async updateMe(
    @AuthenticatedUser() authenticatedUser: User,
    @Body() body: VProfile,
  ): Promise<DUserProfile> {
    const updatedUser = await this.userService.update(authenticatedUser, body);
    return new DUserProfile(updatedUser);
  }

  @Put('/type')
  @UserRoles(USER_ROLE.DEFAULT)
  public async changeType(
    @AuthenticatedUser() authenticatedUser: User,
    @Body() data: VChangeUserRole,
  ): Promise<DUserProfile> {
    const updatedUser = await this.userService.update(authenticatedUser, data);
    return new DUserProfile(updatedUser);
  }

  @Post()
  public async updateMyPassword(
    @AuthenticatedUser() authenticatedUser: User,
    @Body() body: VUpdatePassword,
  ): Promise<{}> {
    await this.userService.updatePassword(authenticatedUser, body.password);
    return {};
  }

  @Post('/image')
  @UseInterceptors(StorageInterceptor('file', STORAGE_TYPE.AWS_S3))
  public async changeProfileImage(
    @AuthenticatedUser() authenticatedUser: User,
    @UploadedFile() image: Express.MulterS3.File,
  ): Promise<DUserProfile> {

    const storedImage = await this.storageService.save(image, STORAGE_TYPE.AWS_S3);

    const user = await this.userService.changeProfileImage(authenticatedUser, storedImage);

    return new DUserProfile(user);
  }

  @Delete('/impersonate')
  public async stopImpersonation(
    @ImpersonatedById() impersonatedById: number,
  ): Promise<DAuthenticatedUser> {
    const user = await this.userService.get(impersonatedById);
    const token = await this.authenticationService.sign(impersonatedById);

    return new DAuthenticatedUser(user, token);
  }
}
