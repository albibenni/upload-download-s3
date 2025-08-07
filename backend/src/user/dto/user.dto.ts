import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class UserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  hashedRefreshToken: string;

  @IsOptional()
  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;
}
