import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "./entities/file.entity";
import {
  createPresignedUrl,
  deleteFile,
  getClient,
  getListOfFiles,
  getPresignedUrl,
} from "./s3.service";
import { AddFileDto, UploadFileDto } from "./dtos/file.dto";
import { User } from "@/user/entities/user.entity";
import config from "@/configs/env-config";
import { handleErrorLog } from "@/utils/utils";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  awsClient = getClient();

  // cronjob to clean db if file upload crash?
  async addFile(
    addFileDto: AddFileDto,
    userId: string,
  ): Promise<UploadFileDto> {
    const existingFile: File | null = await this.fileRepository.findOne({
      where: { filename: addFileDto.filename },
    });

    if (existingFile) {
      throw new ConflictException("Filename already exists");
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const presignedUrl = await createPresignedUrl(
      this.awsClient,
      config.aws.bucket,
      user.username,
      addFileDto.filename,
      addFileDto.mimetype || "application/octet-stream",
    );
    if (!presignedUrl) {
      throw new NotFoundException("Presigned URL could not be created");
    }
    const fileUploaded = this.fileRepository.create({
      ...addFileDto,
      username: user.username,
    });
    await this.fileRepository.save(fileUploaded);
    return {
      id: fileUploaded.id,
      filename: fileUploaded.filename,
      username: fileUploaded.username,
      presignedUrl,
      createdAt: fileUploaded.createdAt,
      updatedAt: fileUploaded.updatedAt,
    };
  }

  async findAll(): Promise<string[]> {
    const list = await getListOfFiles(this.awsClient, config.aws.bucket);
    if (!list) {
      throw new NotFoundException(
        `List of File not found in bucket ${config.aws.bucket}`,
      );
    }
    return list;
  }

  async getFile(filePath: string): Promise<string> {
    const filesSplit = filePath.split("/");
    if (filesSplit.length < 2) {
      throw new NotFoundException(`File path is not valid`);
    }
    const fileName = filesSplit.pop()!;
    const folderPath = filesSplit.join("/");
    const presignedUrl = await getPresignedUrl(
      this.awsClient,
      config.aws.bucket,
      folderPath,
      fileName,
    );
    if (!presignedUrl) {
      throw new NotFoundException(`Presigned not created`);
    }
    return presignedUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await deleteFile(this.awsClient, config.aws.bucket, filePath);
      await this.fileRepository.delete({
        filename: filePath.split("/").pop()!,
      });
    } catch (error) {
      handleErrorLog(error);
    }
  }
}
