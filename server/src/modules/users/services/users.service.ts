import { UsersRepository } from "../repositories/users.repository";
import { UserEntity } from "../user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findByEmail(email);
  }

  public findByID(ID: string): Promise<UserEntity | null> {
    return this.usersRepository.findByID(ID);
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
    return this.usersRepository.remove(user);
  }

  public async verifyEmailByID(ID: string): Promise<boolean> {
    const { affected } = await this.usersRepository.verifyEmailByID(ID);

    if (affected === 0 || affected === undefined) return false;

    return true;
  }

  public async updateHash(ID: string, hash: string): Promise<boolean> {
    const { affected } = await this.usersRepository.updateHash(ID, hash);

    if (affected === 0 || affected === undefined) return false;

    return true;
  }
}
