import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export type JwtPayload = {
  sub: string;
};

// interface RequestWithUser extends Request {
//   user: JwtPayload;
// }

// @Injectable()
// export class JwtAuthGuard2 implements CanActivate {
//   constructor(private authService: AuthService) {}
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<RequestWithUser>();
//     const token = this.extractTokenFromHeader(request);
//
//     if (!token) {
//       throw new UnauthorizedException("No token provided");
//     }
//
//     try {
//       const payload = (await this.authService.verifyToken(token)) as JwtPayload;
//       request.user = payload;
//     } catch {
//       throw new UnauthorizedException("No token provided");
//     }
//     return true;
//   }
//
//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(" ") ?? [];
//     return type === "Bearer" ? token : undefined;
//   }
// }

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
