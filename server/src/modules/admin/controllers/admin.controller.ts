import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiRateLimitExceededResponse } from "src/common/decorators/swagger/rateLimitExceeded.decorator";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { AdminInstanceListResponseDto, AdminInstancesQueryDto } from "../dtos/adminInstance.dto";
import { AdminSessionListResponseDto, AdminSessionsQueryDto } from "../dtos/adminSession.dto";
import { AdminUserIdParamsDto, AdminUserListResponseDto, AdminUsersQueryDto } from "../dtos/adminUser.dto";
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
