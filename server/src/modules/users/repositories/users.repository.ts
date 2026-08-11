import { InjectRepository } from "@nestjs/typeorm";
import { UpdateResult } from "typeorm/browser";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public verifyEmailByID(ID: string): Promise<UpdateResult> {
    return this.usersRepository.update({ ID: ID }, { emailVerified: true });
  }

  public updateHash(ID: string, hash: string): Promise<UpdateResult> {
    return this.usersRepository.update({ ID: ID }, { hash: hash });
  }

  public remove(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.remove(user);
  }

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ email: email });
  }

  public findByID(ID: string): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy({ ID: ID });
  }

  public create(props: Partial<UserEntity>): UserEntity {
    return this.usersRepository.create(props);
  }

  public save(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
