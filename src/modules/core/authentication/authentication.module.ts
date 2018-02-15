import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Module({
  components: [
    AuthenticationService,
  ],
})
export class AuthenticationModule {
}
