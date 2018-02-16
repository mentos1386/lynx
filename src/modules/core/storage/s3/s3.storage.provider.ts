import { AWS_S3_PROVIDER, STORAGE_S3_PROVIDER } from './s3.constants';
import * as s3Storage from 'multer-s3';
import { S3 } from 'aws-sdk';

export const s3StorageProvider = {
  provide: STORAGE_S3_PROVIDER,
  useFactory: (awsS3Provider: S3) => {
    const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

    return s3Storage({
      s3: awsS3Provider,
      bucket: AWS_S3_BUCKET,
      metadata:
        (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
      key:
        (req, file, cb) => {
          cb(null, Date.now().toString());
        },
    });
  },
  inject: [AWS_S3_PROVIDER],
};
