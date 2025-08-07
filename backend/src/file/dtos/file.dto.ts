import { IsString, MaxLength } from "class-validator";

export class FileDto {
  @IsString()
  id: string;

  @IsString()
  @MaxLength(255)
  filename: string;

  @IsString()
  username: string;

  createdAt: Date;
  updatedAt: Date;
}

export class UploadFileDto {
  @IsString()
  id: string;

  @IsString()
  @MaxLength(255)
  filename: string;

  @IsString()
  username: string;

  @IsString()
  presignedUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
export class AddFileDto {
  @IsString()
  @MaxLength(255)
  filename: string;

  @IsString()
  mimetype: string;
}

export class UpdateFileDto {
  @IsString()
  @MaxLength(255)
  filename: string;
}
