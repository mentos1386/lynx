import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { AuthenticationService } from '../modules/core/authentication/authentication.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
  ) {
  }

  resolve(): any {
    return async (req, res, next: Function) => {
      const authorization: string = req.headers.authorization;

      if (authorization) {
        const jwtObject = this.authenticationService.verify(authorization);

        req.impersonatedById = jwtObject.impersonatedById;
        req.user = await this.userService.get(jwtObject.userId);
      }

      next();
    };
  }
}
