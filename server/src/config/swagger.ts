import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, Logger } from "@nestjs/common";
import { env } from "./env";

export function setupSwagger(app: INestApplication<any>) {
  if (env.NODE_ENV !== "production") {
    const builder = new DocumentBuilder().setTitle("PocketDock API").setVersion("1.0.0");

    builder.addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Access token JWT enviado no header Authorization: Bearer <token>.",
      },
      "access-token",
    );

    builder.addCookieAuth(
      "refresh",
      {
        type: "apiKey",
        in: "cookie",
        name: "refresh",
        description: "Refresh token armazenado em cookie httpOnly, enviado automaticamente pelo navegador.",
      },
      "refresh-token",
    );

    const config = builder.build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api/docs", app, document);

    Logger.log("Swagger http://localhost:3000/api/docs", "Swagger");
  }
}
