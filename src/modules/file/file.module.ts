import { MiddlewaresConsumer, Module, NestModule } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { UploadMiddleware } from '../../middlewares/upload.middleware';
import { fileProviders } from './file.providers';
import { DatabaseModule } from '../core/database/database.module';

@Module({
  modules: [
    DatabaseModule,
  ],
  controllers: [
    FileController,
  ],
  components: [
    ...fileProviders,
    FileService,
  ],
  exports: [
    FileService,
  ],
})
export class FileModule implements NestModule {

  public configure(consumer: MiddlewaresConsumer): void {

    consumer.apply(UploadMiddleware)
    .with({ single: 'file' })
    .forRoutes({ path: 'v1/file/upload' });

  }

}
