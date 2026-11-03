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

  public findAll(limit: number, offset: number, userId?: string): Promise<[InstanceEntity[], number]> {
    const select = {
      id: true,
      userId: true,
      status: true,
      containerName: true,
      createdAt: true,
      updatedAt: true,
      user: {
        id: true,
        username: true,
        email: true,
      },
    };

    return this.instanceRepository.findAndCount({
      select: select,
      relations: { user: true },
      where: userId === undefined ? {} : { userId: userId },
      order: { createdAt: "DESC", id: "DESC" },
      take: limit,
      skip: offset,
    });
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
