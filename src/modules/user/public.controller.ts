import { Body, Controller, Get, Headers, Post, Put, Query } from '@nestjs/common';
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

@Controller()
export class PublicUserController {

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
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

  @Post('/login/google')
  public async loginWithGoogle(@Body() body: VToken): Promise<DAuthenticatedUser> {
    const { user, created } = await this.userService.loginWithGoogle(body.token);
    const token = this.authenticationService.sign(user.id);

    return new DAuthenticatedUser(user, token, created);
  }

  @Post('/login/facebook')
  public async loginWithFacebook(@Body() body: VToken): Promise<DAuthenticatedUser> {
    const { user, created } = await this.userService.loginWithFacebook(body.token);
    const token = this.authenticationService.sign(user.id);

    return new DAuthenticatedUser(user, token, created);
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
