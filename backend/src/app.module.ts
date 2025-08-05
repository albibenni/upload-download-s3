import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import getCommonConfig from './configs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app/app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [getCommonConfig] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
