import { STORAGE_S3_PROVIDER } from './s3.constants';
import { S3 } from 'aws-sdk';
import * as s3Storage from 'multer-s3';

export const s3StorageProvider = {
  provide: STORAGE_S3_PROVIDER,
  useFactory: () => {
    const AWS_S3_REGION = process.env.AWS_S3_REGION;
    const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

    const s3 = new S3({
      region: AWS_S3_REGION,
    });

    return s3Storage({
      s3,
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
};
