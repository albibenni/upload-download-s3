import { ConfigType } from "@nestjs/config";
import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "../guards/jwt-auth.guard";
import jwtConfig from "../config/jwt.config";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtTokenConfig: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtTokenConfig.secret ?? "",
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): Promise<string> {
    const userId = payload.sub;
    return this.authService.validateJwtUser(userId);
  }
}
