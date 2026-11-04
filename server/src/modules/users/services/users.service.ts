import { LastAdminException } from "../exceptions/lastAdmin.exception";
import { UserNotFoundException } from "../exceptions/userNotFoundException.exception";
import { InstancesService } from "src/modules/instances/services/instances.service";
import { UsersRepository } from "../repositories/users.repository";
import { UserEntity } from "../user.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { env } from "src/config/env";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly instancesService: InstancesService,
    private readonly dataSource: DataSource,
  ) {}

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email.trim().toLowerCase());
  }

  public findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }

  public findAll(limit: number, offset: number): Promise<[UserEntity[], number]> {
    return this.usersRepository.findAll(limit, offset);
  }

  public async create(email: string, username: string, hash?: string): Promise<UserEntity> {
    const normalizeEmail = email.trim().toLowerCase();

    const user = this.usersRepository.create({
      isAdmin: env.BOOTSTRAP_ADMIN_EMAIL.includes(normalizeEmail),
      username: username.trim(),
      email: normalizeEmail,
      hash: hash,
    });

    return this.usersRepository.save(user);
  }

  public async remove(user: UserEntity): Promise<UserEntity> {
    await this.verifyLastAdmin(user);

    await this.instancesService.removeAllContainersByUserId(user.id);

    return this.usersRepository.remove(user);
  }

  private async verifyLastAdmin(user: UserEntity): Promise<void> {
    if (user.isAdmin === false) return;

    const adminCount = await this.usersRepository.countByAdmin();

    if (adminCount <= 1) throw new LastAdminException();
  }

  public async promoteUser(id: string): Promise<UserEntity> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, { where: { id } });

      if (user === null) throw new UserNotFoundException();

      if (user.isAdmin === false) {
        user.isAdmin = true;
        await manager.save(user);
      }

      return user;
    });
  }

  public async demoteUser(id: string): Promise<UserEntity> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, { where: { id } });

      if (user === null) throw new UserNotFoundException();

      if (user.isAdmin === false) return user;

      const adminCount = await manager.count(UserEntity, { where: { isAdmin: true } });

      if (adminCount <= 1) throw new LastAdminException();

      user.isAdmin = false;
      await manager.save(user);

      return user;
    });
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
