import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt",
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshTokenConfig.secret ?? "",
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const refreshToken = req.headers["authorization"]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ?.replace("Bearer", "")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .trim();
    console.log("REEEEEEEE - freshing", refreshToken);

    if (!refreshToken) {
      throw new Error("Wrong Refresh token");
    }
    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
