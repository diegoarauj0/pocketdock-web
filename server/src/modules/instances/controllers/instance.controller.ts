import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";
import { Session } from "src/modules/auth/decorators/session.decorator";
import { InstanceService } from "../services/instance.service";
import { InstanceMapper } from "../instance.mapper";
import { UserEntity } from "src/modules/users/user.entity";
import { InstanceIDParamsDto, InstancePrivateDto } from "../dtos/instance.dto";

@Controller("api/instances")
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}

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
    const instance = await this.instanceService.create(user.ID);

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
    const instances = await this.instanceService.findAllByUserId(user.ID);

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
  @Get(":ID")
  @HttpCode(HttpStatus.OK)
  public async findOne(@Session() { user }: { user: UserEntity }, @Param() { ID }: InstanceIDParamsDto) {
    const instance = await this.instanceService.findOwnedById(ID, user.ID);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Pausar instância",
    description: "Pausa o container da instância do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância pausada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post(":ID/pause")
  @HttpCode(HttpStatus.OK)
  public async pause(@Session() { user }: { user: UserEntity }, @Param() { ID }: InstanceIDParamsDto) {
    const instance = await this.instanceService.pause(ID, user.ID);

    return InstanceMapper.toPrivate(instance);
  }

  @ApiOperation({
    summary: "Retomar instância",
    description: "Retoma o container da instância do usuário autenticado.",
  })
  @ApiOkResponse({ description: "Instância retomada com sucesso.", type: SuccessResponseDto(InstancePrivateDto) })
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  @Post(":ID/resume")
  @HttpCode(HttpStatus.OK)
  public async resume(@Session() { user }: { user: UserEntity }, @Param() { ID }: InstanceIDParamsDto) {
    const instance = await this.instanceService.resume(ID, user.ID);

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
  @Delete(":ID")
  @HttpCode(HttpStatus.OK)
  public async remove(@Session() { user }: { user: UserEntity }, @Param() { ID }: InstanceIDParamsDto) {
    const instance = await this.instanceService.remove(ID, user.ID);

    return InstanceMapper.toPrivate(instance);
  }
}
