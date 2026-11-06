import { DockerProvisionerService } from "./infrastructure/docker/services/dockerProvisioner.service";
import { LogLevel } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { setupSwagger } from "./config/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { env } from "./config/env";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: env.LOG_CONTEXTS as LogLevel[],
  });

  app.enableShutdownHooks();

  await app.get(DockerProvisionerService).provision();

  configureApp(app);

  await app.listen(env.PORT);
}

function configureApp(app: NestExpressApplication) {
  if (env.TRUST_PROXY) {
    app.set("trust proxy", true);
  }

  app.use(helmet());

  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  app.use(cookieParser());

  setupSwagger(app);
}

bootstrap().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
