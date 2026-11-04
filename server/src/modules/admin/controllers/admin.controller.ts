import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiRateLimitExceededResponse } from "src/common/decorators/swagger/rateLimitExceeded.decorator";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import {
  AdminInstanceIdParamsDto,
  AdminInstanceListResponseDto,
  AdminInstanceResponseDto,
  AdminInstancesQueryDto,
} from "../dtos/adminInstance.dto";
import { AdminSessionIdParamsDto, AdminSessionListResponseDto, AdminSessionsQueryDto } from "../dtos/adminSession.dto";
import {
  AdminUserIdParamsDto,
  AdminUserListResponseDto,
  AdminUserResponseDto,
  AdminUsersQueryDto,
} from "../dtos/adminUser.dto";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";
import { AdminOnly } from "src/modules/auth/decorators/adminOnly.decorator";
import { PublicUserResponseDto } from "src/modules/users/dtos/user.dto";
import { AdminInstanceMapper } from "../adminInstance.mapper";
import { AdminSessionMapper } from "../adminSession.mapper";
import { AdminUserMapper } from "../adminUser.mapper";
import { UserMapper } from "src/modules/users/user.mapper";
import { ADMIN_CONSTANT } from "../admin.constant";
import { AdminService } from "../services/admin.service";
import { Throttle } from "@nestjs/throttler";

@AdminOnly()
@Controller("api/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: "Listar usuários",
    description: "Lista todos os usuários com paginação. O e-mail é retornado truncado.",
  })
  @ApiOkResponse({
    description: "Usuários listados com sucesso.",
    type: SuccessResponseDto(AdminUserListResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get("users")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.LIST_USERS })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async findAllUsers(@Query() query: AdminUsersQueryDto) {
    const [users, total] = await this.adminService.findAllUsers(query.limit, query.offset);

    return {
      items: users.map((user) => AdminUserMapper.toResponse(user)),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  @ApiOperation({
    summary: "Buscar usuário",
    description: "Retorna os dados administrativos de um usuário específico.",
  })
  @ApiOkResponse({
    description: "Usuário encontrado.",
    type: SuccessResponseDto(AdminUserResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get("users/:id")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.LIST_USERS })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async findUserById(@Param() { id }: AdminUserIdParamsDto) {
    const user = await this.adminService.findUserById(id);

    return AdminUserMapper.toResponse(user);
  }

  @ApiOperation({
    summary: "Deletar usuário",
    description:
      "Exclui a conta do usuário e todos os dados associados. Não é possível deletar o último administrador.",
  })
  @ApiOkResponse({
    description: "Usuário deletado com sucesso.",
    type: SuccessResponseDto(PublicUserResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Delete("users/:id")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.DELETE_USER })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param() { id }: AdminUserIdParamsDto) {
    const user = await this.adminService.deleteUser(id);

    return UserMapper.toPublic(user);
  }

  @ApiOperation({
    summary: "Listar instâncias",
    description: "Lista todas as instâncias com paginação e filtro opcional por usuário.",
  })
  @ApiOkResponse({
    description: "Instâncias listadas com sucesso.",
    type: SuccessResponseDto(AdminInstanceListResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get("instances")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.LIST_INSTANCES })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async findAllInstances(@Query() query: AdminInstancesQueryDto) {
    const [instances, total] = await this.adminService.findAllInstances(query.limit, query.offset, query.userId);

    return {
      items: instances.map((instance) => AdminInstanceMapper.toResponse(instance)),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  @ApiOperation({
    summary: "Deletar instância",
    description: "Exclui uma instância específica, independentemente do usuário dono.",
  })
  @ApiOkResponse({
    description: "Instância deletada com sucesso.",
    type: SuccessResponseDto(AdminInstanceResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Delete("instances/:id")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.DELETE_INSTANCE })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async deleteInstance(@Param() { id }: AdminInstanceIdParamsDto) {
    const instance = await this.adminService.deleteInstance(id);

    return AdminInstanceMapper.toResponse(instance);
  }

  @ApiOperation({
    summary: "Listar sessões",
    description:
      "Lista todas as sessões com paginação e filtro opcional por usuário. IP e user-agent são retornados truncados.",
  })
  @ApiOkResponse({
    description: "Sessões listadas com sucesso.",
    type: SuccessResponseDto(AdminSessionListResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get("sessions")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.LIST_SESSIONS })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async findAllSessions(@Query() query: AdminSessionsQueryDto) {
    const [sessions, total] = await this.adminService.findAllSessions(query.limit, query.offset, query.userId);

    return {
      items: sessions.map((session) => AdminSessionMapper.toResponse(session)),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  @ApiOperation({
    summary: "Revogar sessão",
    description: "Revoga uma sessão específica. O motivo da revogação é registrado como ADMIN.",
  })
  @ApiOkResponse({
    description: "Sessão revogada com sucesso.",
    type: SuccessResponseDto(),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post("sessions/:id/revoke")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.REVOKE_SESSION })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async revokeSession(@Param() { id }: AdminSessionIdParamsDto): Promise<void> {
    await this.adminService.revokeSession(id);
  }

  @ApiOperation({
    summary: "Revogar todas as sessões de um usuário",
    description: "Revoga todas as sessões ativas de um usuário. O motivo da revogação é registrado como ADMIN.",
  })
  @ApiOkResponse({
    description: "Sessões do usuário revogadas com sucesso.",
    type: SuccessResponseDto(),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post("users/:id/sessions/revoke-all")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.REVOKE_SESSION })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async revokeAllUserSessions(@Param() { id }: AdminUserIdParamsDto): Promise<void> {
    await this.adminService.revokeAllUserSessions(id);
  }

  @ApiOperation({
    summary: "Promover usuário a admin",
    description: "Concede acesso administrativo a um usuário existente.",
  })
  @ApiOkResponse({
    description: "Usuário promovido a admin com sucesso.",
    type: SuccessResponseDto(PublicUserResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post("users/:id/promote")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.ROLE })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async promote(@Param() { id }: AdminUserIdParamsDto) {
    const user = await this.adminService.promoteUser(id);

    return UserMapper.toPublic(user);
  }

  @ApiOperation({
    summary: "Despromover usuário de admin",
    description: "Remove o acesso administrativo de um usuário existente.",
  })
  @ApiOkResponse({
    description: "Usuário despromovido de admin com sucesso.",
    type: SuccessResponseDto(PublicUserResponseDto),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post("users/:id/demote")
  @Throttle({ default: ADMIN_CONSTANT.THROTTLE.ROLE })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  public async demote(@Param() { id }: AdminUserIdParamsDto): Promise<PublicUserResponseDto> {
    const user = await this.adminService.demoteUser(id);

    return UserMapper.toPublic(user);
  }
}
