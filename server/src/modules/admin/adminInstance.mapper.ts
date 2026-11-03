import { AdminInstanceResponseDto } from "./dtos/adminInstance.dto";
import { InstanceEntity } from "src/modules/instances/instance.entity";
import { maskEmail } from "./helpers/maskEmail.helper";
import { env } from "src/config/env";

export class AdminInstanceMapper {
  public static toResponse(instance: InstanceEntity): AdminInstanceResponseDto {
    return {
      id: instance.id,
      userId: instance.userId,
      user: {
        id: instance.user.id,
        username: instance.user.username,
        email: maskEmail(instance.user.email),
      },
      status: instance.status,
      containerName: instance.containerName,
      url: `${env.INSTANCE_PROTOCOL}://${instance.id}.${env.INSTANCE_DOMAIN}`,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    };
  }
}
