import { RequestWithUser } from "@/auth/auth.controller";
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FileService } from "./file.service";
import { AddFileDto, UploadFileDto } from "./dtos/file.dto";

@Controller("files")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    //private readonly authService: AuthService,
  ) {}
  @Get("all")
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<string[]> {
    return this.fileService.findAll();
  }

  @Post("file")
  @UseGuards(JwtAuthGuard)
  findFile(@Body() body: { filePath: string }): Promise<string> {
    return this.fileService.getFile(body.filePath);
  }

  @Delete("file")
  @UseGuards(JwtAuthGuard)
  deleteFile(@Body() body: { filePath: string }): Promise<void> {
    return this.fileService.deleteFile(body.filePath);
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  uploadFile(
    @Body() body: AddFileDto,
    @Req() req: RequestWithUser,
  ): Promise<UploadFileDto> {
    const userId = req.user.id;
    console.log("BODY", body);

    return this.fileService.addFile(body, userId);
  }
}
