import { ApiInvalidSessionResponse } from "src/common/decorators/swagger/invalidSession.decorator";
import { ApiRateLimitExceededResponse } from "src/common/decorators/swagger/rateLimitExceeded.decorator";
import { ApiInvalidTokenResponse } from "src/common/decorators/swagger/invalidToken.decorator";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { Controller, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { SuccessResponseDto } from "src/common/dtos/successResponse.dto";
import { Session } from "src/modules/auth/decorators/session.decorator";
import { UsersService } from "../services/users.service";
import { UserMapper } from "../user.mapper";
import { UserEntity } from "../user.entity";
import { USER_CONSTANT } from "../user.constant";
import { Throttle } from "@nestjs/throttler";
import * as DTOs from "../dtos/user.dto";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "Excluir conta",
    description: "Exclui a conta do usuário autenticado e retorna seus dados públicos.",
  })
  @ApiOkResponse({ description: "Conta excluída com sucesso.", type: SuccessResponseDto(DTOs.PublicUserResponseDto) })
  @Delete()
  @Throttle({ default: USER_CONSTANT.THROTTLE.DELETE_ACCOUNT })
  @ApiRateLimitExceededResponse()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiInvalidTokenResponse()
  @ApiInvalidSessionResponse()
  public async delete(@Session() { user }: { user: UserEntity }) {
    const result = await this.usersService.remove(user);

    return UserMapper.toPublic(result);
  }
}
