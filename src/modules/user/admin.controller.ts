import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { VBlocked, VUserQuery } from './user.validations';
import { UserRoles } from './guards/roles.decorator';
import { USER_ROLE } from './user.constants';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { DAuthenticatedUser, DUserProfile } from './user.dto';
import { Pagination } from '../core/pagination/pagination.decorator';
import { VPagination } from '../core/pagination/pagination.validation';
import { AuthenticatedUser } from '../core/authentication/authentication.decorators';
import { User } from './user.entity';

@Controller()
@UserRoles(USER_ROLE.ADMIN)
export class AdminUserController {

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
  }

  @Get()
  public async list(
    @Query() query: VUserQuery,
    @Pagination() pagination: VPagination,
  ) {
    return this.userService.list(query, pagination);
  }

  @Get('/:userId')
  public async getUser(
    @Param('userId') userId: number,
  ): Promise<DUserProfile> {
    const user = await this.userService.get(userId);
    return new DUserProfile(user);
  }

  @Put('/:userId/block')
  public async blockUser(
    @Param('userId') userId: number,
    @Body() data: VBlocked,
  ): Promise<{}> {
    const user = await this.userService.get(userId);
    await this.userService.update(user, { blocked: data.blocked });
    return {};
  }

  @Post('/:userId/impersonate')
  public async impersonate(
    @Param('userId') userId: number,
    @AuthenticatedUser() authenticatedUser: User,
  ): Promise<DAuthenticatedUser> {
    const user = await this.userService.get(userId);
    const token = await this.authenticationService.sign(user.id, authenticatedUser.id);

    return new DAuthenticatedUser(user, token, false, authenticatedUser.id);
  }
}
