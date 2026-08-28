import { ValidationErrorException } from "./common/exceptions/validation.exception";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./common/filters/globalException.filter";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { DockerModule } from "./infrastructure/docker/docker.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { InstanceModule } from "./modules/instances/instance.module";
import { Module, ValidationPipe } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          exceptionFactory: (errors) => new ValidationErrorException(errors),
          whitelist: true,
          transform: true,
        });
      },
    },
  ],
  imports: [DatabaseModule, AuthModule, UsersModule, InstanceModule, DockerModule],
})
export class AppModule {}
