import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  components: [
    EmailService,
  ],
  exports: [
    EmailService,
  ],
})
export class EmailModule {
}
