import { ApiProperty } from "@nestjs/swagger";
import { Type } from "@nestjs/common";

export function SuccessResponseDto<T>(classRef?: Type<T>, isArray: boolean = false) {
  let name = classRef?.name ?? "Null";

  name = name.replace("Dto", "");
  name = name.replace("Response", "");

  class ResponseSuccess {
    @ApiProperty({ type: "boolean", nullable: false })
    public success!: true;

    @ApiProperty({
      type: classRef === undefined ? "null" : classRef,
      nullable: classRef === undefined ? true : false,
      example: classRef === undefined ? "null" : classRef,
      isArray: isArray,
    })
    public data!: T | null;

    @ApiProperty({ type: "string", nullable: false })
    public timestamp!: string;
  }

  Object.defineProperty(ResponseSuccess, "name", {
    value: `${name}ResponseSuccessDto`,
  });

  return ResponseSuccess;
}
