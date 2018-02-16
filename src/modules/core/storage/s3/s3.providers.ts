import { S3 } from 'aws-sdk';
import { AWS_S3_PROVIDER } from './s3.constants';

export const awsS3Providers = [
  {
    provide: AWS_S3_PROVIDER,
    useFactory: () => {
      const AWS_S3_REGION = process.env.AWS_S3_REGION;

      return new S3({
        // Other configuration is taken from ENV
        region: AWS_S3_REGION,
      });
    },
  },
];
