import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { s3StorageProvider } from './s3/s3.storage.provider';
import { diskStorageProvider } from './disk/disk.storage.provider';
import { awsS3Providers } from './s3/s3.providers';
import { StorageS3Service } from './s3/s3.service';
import { StorageDiskService } from './disk/disk.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageEntity } from './storage.entity';
import { StorageRepository } from './storage.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageEntity, StorageRepository]),
  ],
  components: [
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
