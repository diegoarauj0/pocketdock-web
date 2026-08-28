import { InstancePrivateDto } from "./dtos/instance.dto";
import { InstanceEntity } from "./instance.entity";

export class InstanceMapper {
  public static toPrivate(instance: InstanceEntity): InstancePrivateDto {
    return {
      ID: instance.ID,
      containerId: instance.containerName,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    };
  }
}
