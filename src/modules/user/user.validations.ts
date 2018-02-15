import {
  IsBoolean,
  IsBooleanString,
  IsDefined,
  IsEmail, IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { VPagination } from '../../validation/pagination.validation';
import { USER_ROLE } from './user.constants';

export class VRegister {
  @IsDefined() @IsString()
  name: string;

  @IsDefined() @IsString() @Length(6)
  password: string;

  @IsDefined() @IsEmail()
  email: string;
}

export class VUpdatePassword {
  @IsDefined() @IsString() @Length(6)
  password: string;
}

export class VProfile {
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  surname: string;

  @IsString()
  homeAddress: string;
  @IsString()
  workAddress: string;
  @IsString()
  description: string;
  @IsString()
  phone: string;
}

export class VToken {
  @IsDefined() @IsString()
  token: string;
}

export class VLoginCredentials {
  @IsEmail()
  email: string;

  @IsDefined() @IsString()
  password: string;
}

export class VRequestReset {
  @IsDefined() @IsString() @IsEmail()
  email: string;
}

export class VPasswordReset {
  @IsDefined() @IsString() @Length(6)
  password: string;
  @IsDefined() @IsString()
  token: string;
}

export class VUserQuery extends VPagination {
  @IsString()
  search: string;

  @IsString() @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @IsBooleanString()
  blocked: string;
}

export class VBlocked {
  @IsBoolean()
  blocked: boolean;
}

export class VChangeUserRole {
  @IsString() @IsEnum(USER_ROLE)
  role: USER_ROLE;
}
