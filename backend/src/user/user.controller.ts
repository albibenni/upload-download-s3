import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateUserDto, UserDto } from "./dto/user.dto";
import { AuthService, type Tokens } from "@/auth/auth.service";
import { RequestWithUser } from "@/auth/auth.controller";
import type { User } from "./entities/user.entity";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("signup")
  signup(@Body() body: UserDto): Promise<User | undefined> {
    return this.authService.signup(body);
  }

  @Post("signin")
  signin(
    @Body() body: Pick<UserDto, "username" | "password">,
  ): Promise<Tokens | undefined> {
    return this.authService.signIn(body.username, body.password);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Post("signout")
  @UseGuards(JwtAuthGuard)
  signout(@Req() req: RequestWithUser): Promise<void> {
    return this.authService.signout(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string): Promise<User> {
    return this.userService.findByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":username")
  remove(@Param("username") username: string): Promise<void> {
    return this.userService.remove(username);
  }
}
