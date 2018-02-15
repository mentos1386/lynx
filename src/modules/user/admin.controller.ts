import { Response } from 'express';
import { Body, Controller, Get, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { VBlocked, VUserQuery } from './user.validations';
import { IRequest } from '../../interfaces/request.interface';
import { Roles } from '../../guards/roles.decorator';
import { USER_ROLE } from './user.constants';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { DAuthenticatedUser, DUserProfile } from './user.dto';

@Controller()
@Roles(USER_ROLE.ADMIN)
export class AdminUserController {

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
  }

  @Get()
  public async list(@Query() query: VUserQuery) {
    return this.userService.list(query);
  }

  @Get('/:userId')
  public async getUser(
    @Req() req: IRequest,
    @Res() res: Response,
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
    @Req() req: IRequest,
    @Res() res: Response,
    @Param('userId') userId: number,
  ): Promise<DAuthenticatedUser> {
    const user = await this.userService.get(userId);
    const token = await this.authenticationService.sign(user.id, req.user.id);

    return new DAuthenticatedUser(user, token, false, req.user.id);
  }
}
