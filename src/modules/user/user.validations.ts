import {
  IsBoolean,
  IsDefined,
  IsEmail, IsEnum,
  IsString,
  Length,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { USER_ROLE } from './user.constants';
import { ToBoolean } from 'class-sanitizer';

export class VRegister {
  @ApiModelProperty()
  @IsDefined() @IsString()
  name: string;

  @ApiModelProperty()
  @IsDefined() @IsString() @Length(6)
  password: string;

  @ApiModelProperty()
  @IsDefined() @IsEmail()
  email: string;
}

export class VUpdatePassword {
  @ApiModelProperty()
  @IsDefined() @IsString() @Length(6)
  password: string;
}

export class VProfile {
  @ApiModelProperty()
  @IsEmail()
  email: string;
  @ApiModelProperty()
  @IsString()
  name: string;
  @ApiModelProperty()
  @IsString()
  surname: string;

  @ApiModelProperty()
  @IsString()
  homeAddress: string;
  @ApiModelProperty()
  @IsString()
  workAddress: string;
  @ApiModelProperty()
  @IsString()
  description: string;
  @ApiModelProperty()
  @IsString()
  phone: string;
}

export class VToken {
  @ApiModelProperty()
  @IsDefined() @IsString()
  token: string;
}

export class VLoginCredentials {
  @ApiModelProperty()
  @IsDefined() @IsEmail()
  email: string;

  @ApiModelProperty()
  @IsDefined() @IsString()
  password: string;
}

export class VRequestReset {
  @ApiModelProperty()
  @IsDefined() @IsString() @IsEmail()
  email: string;
}

export class VPasswordReset {
  @ApiModelProperty()
  @IsDefined() @IsString() @Length(6)
  password: string;
  @ApiModelProperty()
  @IsDefined() @IsString()
  token: string;
}

export class VUserQuery {
  @ApiModelProperty()
  @IsString()
  search: string;

  @ApiModelProperty()
  @IsString() @IsEnum(USER_ROLE)
  role: USER_ROLE;

  @ApiModelProperty()
  @IsBoolean() @ToBoolean()
  blocked: boolean;
}

export class VBlocked {
  @ApiModelProperty()
  @IsBoolean()
  blocked: boolean;
}

export class VChangeUserRole {
  @ApiModelProperty()
  @IsString() @IsEnum(USER_ROLE)
  role: USER_ROLE;
}
