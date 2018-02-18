import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { StorageModule } from '../core/storage/storage.module';
import { DemoController } from './demo.controller';

@Module({
  imports: [
    AuthenticationModule,
    StorageModule,
  ],
  controllers: [
    DemoController,
  ],
  components: [],
  exports: [],
})
export class DemoModule {
}
