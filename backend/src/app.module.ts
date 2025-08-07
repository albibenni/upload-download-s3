import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./services/app/app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { File } from "./file/entities/file.entity";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, File],
      synchronize: true, // Set to false in production
      logging: true,
    }),
    AuthModule,
    UserModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
