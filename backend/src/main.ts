import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new ConsoleLogger({
    prefix: "prefix",
  });
  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    logger,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*",
  });

  const port = Number(process.env.SERVER_PORT) || 3000; // Default to 3000 if not set
  const host = process.env.SERVER_HOST || "localhost"; // Default to localhost if not set

  await app.listen(port, host, () => {
    logger.log(`Server is running on http://${host}:${port}`);
  });
}

void bootstrap();
