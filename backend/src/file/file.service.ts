import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "./entities/file.entity";
import { handleErrorLog } from "@/utils/utils";
import { createPresignedUrl, getClient, getListOfFiles } from "./s3.service";
import { AddFileDto, UploadFileDto } from "./dtos/file.dto";
import { User } from "@/user/entities/user.entity";
import { UpdateUserDto } from "@/user/dto/user.dto";
import config from "@/configs/env-config";

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

  // async findAllProtected(userId: string): Promise<string[]> {
  //   const
  // }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateRefreshToken(refreshToken: string, userId: string) {
    return await this.userRepository.update(
      { id: userId },
      { hashedRefreshToken: refreshToken },
    );
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.find({ where: { username } });

    if (user.length === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user[0]!;
  }

  async update(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    try {
      const user = await this.findByUsername(username);
      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    } catch (error) {
      handleErrorLog(error);
    }
  }

  async remove(username: string): Promise<void> {
    const user = await this.findByUsername(username);
    await this.userRepository.remove(user);
  }
}
