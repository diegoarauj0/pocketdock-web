import { InstancesService } from "src/modules/instances/services/instances.service";
import { UsersRepository } from "../repositories/users.repository";
import { UserEntity } from "../user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly instancesService: InstancesService,
  ) {}

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  public findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  public async create(email: string, username: string, hash?: string): Promise<UserEntity> {
    const user = this.usersRepository.create({
      username: username.trim(),
      email: email,
      hash: hash,
    });

    return this.usersRepository.save(user);
  }

  public async remove(user: UserEntity): Promise<UserEntity> {
    await this.instancesService.removeAllContainersByUserId(user.id);

    return this.usersRepository.remove(user);
  }

  public async verifyEmailById(id: string): Promise<boolean> {
    const { affected } = await this.usersRepository.verifyEmailById(id);

    if (affected === 0 || affected === undefined) return false;

    return true;
  }

  public async updateHash(id: string, hash: string): Promise<boolean> {
    const { affected } = await this.usersRepository.updateHash(id, hash);

    if (affected === 0 || affected === undefined) return false;

    return true;
  }
}
