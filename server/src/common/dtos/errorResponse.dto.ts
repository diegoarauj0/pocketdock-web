import { BaseExceptionCode } from "../exceptions/base.exception";
import { ApiProperty } from "@nestjs/swagger";

export function ErrorResponseDto(name: string, message?: string, statusCode?: number, code?: BaseExceptionCode) {
  class ErrorDto {
    @ApiProperty({ type: "string", nullable: false, example: message })
    public message!: string;

    @ApiProperty({ type: "string", nullable: false, enum: BaseExceptionCode, example: code })
    public code!: BaseExceptionCode;

    @ApiProperty()
    public details!: unknown;
  }

  Object.defineProperty(ErrorDto, "name", {
    value: `${name}ErrorDto`,
  });

  class ErrorResponse {
    @ApiProperty({ type: "boolean", nullable: false, example: false })
    public success!: true;

    @ApiProperty({ type: "number", nullable: false, example: statusCode })
    public statusCode!: number;

    @ApiProperty({ type: ErrorDto })
    public error!: ErrorDto;

    @ApiProperty({ type: "string", nullable: false })
    public timestamp!: string;
  }

  Object.defineProperty(ErrorResponse, "name", {
    value: `${name}ResponseErrorDto`,
  });

  return ErrorResponse;
}
