import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module"; //todo
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { File } from "./entities/file.entity";
import { User } from "@/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([File, User]), AuthModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
