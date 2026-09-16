import { InstanceEntity } from "../instance.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository } from "typeorm";

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

  public remove(instance: InstanceEntity): Promise<InstanceEntity> {
    return this.instanceRepository.remove(instance);
  }

  public delete(id: string): Promise<DeleteResult> {
    return this.instanceRepository.delete({ id: id });
  }
}
