import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export type JwtPayload = {
  sub: string;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
