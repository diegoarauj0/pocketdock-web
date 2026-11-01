import { InstanceEntity, InstanceStatus } from "../instance.entity";
import { Repository, UpdateResult } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InstanceRepository {
  constructor(
    @InjectRepository(InstanceEntity)
    private readonly instanceRepository: Repository<InstanceEntity>,
  ) {}

  public findByIdAndUserId(id: string, userId: string): Promise<InstanceEntity | null> {
    return this.instanceRepository.findOne({ where: { id: id, userId: userId } });
  }

  public findByUserId(userId: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.find({ where: { userId: userId } });
  }

  public create(props: Partial<InstanceEntity>): InstanceEntity {
    return this.instanceRepository.create(props);
  }

  public save(instance: InstanceEntity): Promise<InstanceEntity> {
    return this.instanceRepository.save(instance);
  }

  public updateStatus(id: string, status: InstanceStatus): Promise<UpdateResult> {
    return this.instanceRepository.update({ id: id }, { status: status });
  }
}
