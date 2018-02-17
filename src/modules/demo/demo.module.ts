import { MiddlewaresConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from '../core/database/database.module';
import { AuthenticationModule } from '../core/authentication/authentication.module';
import { StorageModule } from '../core/storage/storage.module';
import { DemoController } from './demo.controller';

@Module({
  modules: [
    DatabaseModule,
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
