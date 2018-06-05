import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Module({
  providers: [
    AuthenticationService,
  ],
  exports: [
    AuthenticationService,
  ],
})
export class AuthenticationModule {
}
