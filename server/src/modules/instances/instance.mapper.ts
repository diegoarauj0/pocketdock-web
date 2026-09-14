import { env } from "src/config/env";
import { InstancePrivateDto } from "./dtos/instance.dto";
import { InstanceEntity } from "./instance.entity";

export class InstanceMapper {
  public static toPrivate(instance: InstanceEntity): InstancePrivateDto {
    return {
      ID: instance.ID,
      containerName: instance.containerName,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
      url: `${env.INSTANCE_PROTOCOL}://${instance.ID}.${env.INSTANCE_DOMAIN}`,
    };
  }
}
