import { MiddlewaresConsumer, Module, NestModule } from '@nestjs/common';
import { FileService } from './file.service';
import { fileProviders } from './file.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  modules: [
    DatabaseModule,
  ],
  components: [
    ...fileProviders,
    FileService,
  ],
  exports: [
    FileService,
  ],
})
export class FileModule {
}
