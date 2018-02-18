import { validate } from 'class-validator';
import { ArgumentMetadata, Pipe, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ValidationException } from './validation.exception';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { sanitize } from 'class-sanitizer';

@Pipe()
export class ValidatorPipe implements PipeTransform<any> {
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metadata)) {
      return value;
    }

    // Transform to class
    const entity = plainToClass(metatype, value);
    // Sanitize
    sanitize(entity);
    // Validate
    const errors = await validate(entity, { skipMissingProperties: true, whitelist: true });

    if (errors.length > 0) throw new ValidationException(errors);

    return entity;
  }

  private toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata;
    if (type === 'custom') {
      return false;
    }
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type) && !isNil(metatype);
  }
}
