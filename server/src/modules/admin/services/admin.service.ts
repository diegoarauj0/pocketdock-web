import { UserNotFoundException } from "src/modules/users/exceptions/userNotFoundException.exception";
import { SessionService } from "src/modules/sessions/services/session.service";
import { InstancesService } from "src/modules/instances/services/instances.service";
import { InstanceEntity } from "src/modules/instances/instance.entity";
import { UsersService } from "src/modules/users/services/users.service";
import { SessionEntity } from "src/modules/sessions/session.entity";
import { UserEntity } from "src/modules/users/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly instancesService: InstancesService,
    private readonly sessionService: SessionService,
  ) {}

  public findAllUsers(limit: number, offset: number): Promise<[UserEntity[], number]> {
    return this.usersService.findAll(limit, offset);
  }

  public async findUserById(id: string): Promise<UserEntity> {
    const user = await this.usersService.findByIdForAdmin(id);

    if (user === null) throw new UserNotFoundException();

    return user;
  }

  public findAllInstances(limit: number, offset: number, userId?: string): Promise<[InstanceEntity[], number]> {
    return this.instancesService.findAll(limit, offset, userId);
  }

  public findAllSessions(limit: number, offset: number, userId?: string): Promise<[SessionEntity[], number]> {
    return this.sessionService.findAll(limit, offset, userId);
  }

  public promoteUser(id: string): Promise<UserEntity> {
    return this.usersService.promoteToAdmin(id);
  }

  public demoteUser(id: string): Promise<UserEntity> {
    return this.usersService.demoteFromAdmin(id);
  }
}
