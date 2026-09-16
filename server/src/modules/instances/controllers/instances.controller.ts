import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { InstanceIdParamsDto, InstancePrivateDto, InstanceStatsDto } from "../dtos/instance.dto";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";
import { Session } from "src/modules/auth/decorators/session.decorator";
import { InstancesService } from "../services/instances.service";
import { UserEntity } from "src/modules/users/user.entity";
import { InstanceMapper } from "../instance.mapper";

@Controller("api/instances")
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @ApiOperation({
    summary: "Criar instância",
    description: "Cria uma nova instância PocketBase para o usuário autenticado.",
  })
  @ApiCreatedResponse({ description: "Instância criada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Session() { user }: { user: UserEntity }) {
    const instance = await this.instancesService.create(user);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Listar instâncias",
    description: "Retorna todas as instâncias do usuário autenticado.",
  })
  @ApiOkResponse({
    description: "Instâncias listadas com sucesso.",
    type: SuccessResponseDto(InstancePrivateDto, true),
  })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(@Session() { user }: { user: UserEntity }) {
    const instances = await this.instancesService.findAllByUserId(user.id);

    return instances.map((instance) => InstanceMapper.toPrivate(instance));
  }

  @ApiOperation({
    summary: "Visualizar instância",
    description: "Retorna os dados de uma instância específica do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância retornada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  public async findOne(@Session() { user }: { user: UserEntity }, @Param() { id }: InstanceIdParamsDto) {
    const instance = await this.instancesService.findOwnedById(id, user.id);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Parar instância",
    description: "Para o container da instância do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância parada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post(":id/stop")
  @HttpCode(HttpStatus.OK)
  public async stop(@Session() { user }: { user: UserEntity }, @Param() { id }: InstanceIdParamsDto) {
    const instance = await this.instancesService.stop(id, user.id);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Iniciar instância",
    description: "Inicia o container da instância do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância iniciada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post(":id/start")
  @HttpCode(HttpStatus.OK)
  public async start(@Session() { user }: { user: UserEntity }, @Param() { id }: InstanceIdParamsDto) {
    const instance = await this.instancesService.start(id, user.id);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Deletar instância",
    description: "Remove o container e o registro da instância do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância deletada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  public async remove(@Session() { user }: { user: UserEntity }, @Param() { id }: InstanceIdParamsDto) {
    const instance = await this.instancesService.remove(id, user.id);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Estatísticas da instância",
    description:
      "Retorna as estatísticas de uso de uma instância específica do usuário autenticado, incluindo o status simplificado (running ou stopped).",
  })
  @ApiOkResponse({ description: "Estatísticas retornadas com sucesso.", type: SuccessResponseDto(InstanceStatsDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Get("stats/:id")
  @HttpCode(HttpStatus.OK)
  public async stats(
    @Session() { user }: { user: UserEntity },
    @Param() { id }: InstanceIdParamsDto,
  ): Promise<InstanceStatsDto> {
    const stats = await this.instancesService.stats(id, user.id);

    return stats;
  }
}
