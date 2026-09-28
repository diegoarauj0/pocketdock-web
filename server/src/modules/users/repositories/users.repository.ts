import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../user.entity";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public verifyEmailById(id: string): Promise<UpdateResult> {
    return this.usersRepository.update({ id: id }, { emailVerified: true });
  }

  public updateHash(id: string, hash: string): Promise<UpdateResult> {
    return this.usersRepository.update({ id: id }, { hash: hash });
  }

  public remove(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.remove(user);
  }

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  public findById(id: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ id: id });
  }

  public create(props: Partial<UserEntity>): UserEntity {
    return this.usersRepository.create(props);
  }

  public save(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
