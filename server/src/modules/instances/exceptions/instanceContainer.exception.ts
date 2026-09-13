import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export enum ContainerErrorReason {
  CREATE_FAILED = "CREATE_FAILED",
  REMOVE_FAILED = "REMOVE_FAILED",
  STOP_FAILED = "STOP_FAILED",
  START_FAILED = "START_FAILED",
  ALREADY_STOPPED = "ALREADY_STOPPED",
  ALREADY_RUNNING = "ALREADY_RUNNING",
}

const reasonToStatusCodeMap: Record<ContainerErrorReason, HttpStatus> = {
  [ContainerErrorReason.CREATE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.REMOVE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.STOP_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.START_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.ALREADY_STOPPED]: HttpStatus.CONFLICT,
  [ContainerErrorReason.ALREADY_RUNNING]: HttpStatus.CONFLICT,
};

const reasonToMessageMap: Record<ContainerErrorReason, string> = {
  [ContainerErrorReason.CREATE_FAILED]: "Failed to create instance container.",

  [ContainerErrorReason.REMOVE_FAILED]: "Failed to remove instance container.",

  [ContainerErrorReason.STOP_FAILED]: "Failed to stop instance container.",

  [ContainerErrorReason.START_FAILED]: "Failed to start instance container.",

  [ContainerErrorReason.ALREADY_STOPPED]: "Instance container is already stopped.",

  [ContainerErrorReason.ALREADY_RUNNING]: "Instance container is already running.",
};

export class InstanceContainerException extends BaseException<{ reason: ContainerErrorReason }> {
  constructor(reason: ContainerErrorReason) {
    super({
      code: BaseExceptionCode.INSTANCE_CONTAINER_ERROR,
      statusCode: reasonToStatusCodeMap[reason],
      message: reasonToMessageMap[reason],
      details: {
        reason,
      },
    });
  }
}
