import { ValidationException } from "./common/exceptions/validation.exception";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./common/filters/globalException.filter";
import { CustomThrottlerGuard } from "./common/guards/customThrottler.guard";
import { THROTTLER_CONSTANT } from "./common/throttler.constant";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { DockerModule } from "./infrastructure/docker/docker.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { OutboxModule } from "./infrastructure/outbox/outbox.module";
import { LockModule } from "./infrastructure/lock/lock.module";
import { InstanceModule } from "./modules/instances/instance.module";
import { AdminModule } from "./modules/admin/admin.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { Module, ValidationPipe } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";

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
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          exceptionFactory: (errors) => new ValidationException(errors),
          whitelist: true,
          transform: true,
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: THROTTLER_CONSTANT.GLOBAL_TTL_MS,
        limit: THROTTLER_CONSTANT.GLOBAL_LIMIT,
        blockDuration: THROTTLER_CONSTANT.GLOBAL_BLOCK_DURATION_MS,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    LockModule,
    OutboxModule,
    AuthModule,
    UsersModule,
    InstanceModule,
    AdminModule,
    DockerModule,
  ],
})
export class AppModule {}
