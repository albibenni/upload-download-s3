import { RequestWithUser } from "@/auth/auth.controller";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
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
  @Post("upload")
  @UseGuards(JwtAuthGuard)
  uploadFile(
    @Body() body: AddFileDto,
    @Req() req: RequestWithUser,
  ): Promise<UploadFileDto> {
    const userId = req.user.id;
    return this.fileService.addFile(body, userId);
  }
}
