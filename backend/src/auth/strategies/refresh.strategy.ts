import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { AuthService } from "../auth.service";
import { z } from "zod/v4";

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt",
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshTokenConfig.secret ?? "",
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const bearerTokenSchema = z
      .union([z.string(), z.array(z.string()), z.undefined()])
      .transform((value) => {
        if (Array.isArray(value)) return value[0];
        return value;
      })
      .pipe(
        z
          .string()
          .regex(/^Bearer\s+\S+$/, "Must be a valid Bearer token")
          .transform((token) => token.replace("Bearer ", ""))
          .optional(),
      );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const refreshToken = bearerTokenSchema.parse(req.headers["authorization"]);
    console.log("REfreshing", refreshToken);

    if (!refreshToken) {
      throw new Error("Wrong Refresh token");
    }
    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
