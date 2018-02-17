import { IStorageService } from '../storage.interface';
import { StorageEntity } from '../storage.entity';
import { S3 } from 'aws-sdk';
import { Component, Inject } from '@nestjs/common';
import { AWS_S3_PROVIDER } from './s3.constants';

@Component()
export class StorageS3Service implements IStorageService {

  private readonly AWS_S3_BUCKET = <string>process.env.AWS_S3_BUCKET;

  constructor(
    @Inject(AWS_S3_PROVIDER) private awsS3: S3,
  ) {
  }

  public async destroy(entity: StorageEntity): Promise<void> {
    // If we change ENV->AWS_S3_BUCKET after save, this will fail
    await this.awsS3.deleteObject({
      Bucket: this.AWS_S3_BUCKET,
      Key: entity.key,
    }).promise();
  }

}
