import { MiddlewaresConsumer, Module } from '@nestjs/common';
import { storageRepositoryProviders } from './storage.providers';
import { DatabaseModule } from '../database/database.module';
import { StorageService } from './storage.service';
import { s3StorageProvider } from './s3/s3.storage.provider';
import { diskStorageProvider } from './disk/disk.storage.provider';
import { awsS3Providers } from './s3/s3.providers';
import { StorageS3Service } from './s3/s3.service';
import { StorageDiskService } from './disk/disk.service';

@Module({
  modules: [
    DatabaseModule,
  ],
  components: [
    ...storageRepositoryProviders,
    StorageService,

    // S3 Storage provider
    ...awsS3Providers, // API Provider
    s3StorageProvider, // Multer Storage Provider
    StorageS3Service,  // Service for modifying uploaded data

    // DISK Storage Provider
    diskStorageProvider, // Multer Storage Provider
    StorageDiskService, // Service for modifying uploaded data
  ],
  exports: [
    StorageService,
    ...awsS3Providers,
    s3StorageProvider,
    diskStorageProvider,
  ],
})
export class StorageModule {
}
