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

  public findByIdAndUserId(ID: string, userID: string): Promise<InstanceEntity | null> {
    return this.instanceRepository.findOne({ where: { ID: ID, userID: userID } });
  }

  public findByUserId(userID: string): Promise<InstanceEntity[]> {
    return this.instanceRepository.find({ where: { userID: userID } });
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

  public delete(ID: string): Promise<DeleteResult> {
    return this.instanceRepository.delete({ ID: ID });
  }
}
