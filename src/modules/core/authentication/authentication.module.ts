import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Module({
  components: [
    AuthenticationService,
  ],
  exports: [
    AuthenticationService,
  ],
})
export class AuthenticationModule {
}
