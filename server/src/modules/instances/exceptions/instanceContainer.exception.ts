import { BaseException, BaseExceptionCode } from "src/common/exceptions/base.exception";
import { HttpStatus } from "@nestjs/common";

export enum ContainerErrorReason {
  CREATE_FAILED = "CREATE_FAILED",
  REMOVE_FAILED = "REMOVE_FAILED",
  PAUSE_FAILED = "PAUSE_FAILED",
  UNPAUSE_FAILED = "UNPAUSE_FAILED",
  ALREADY_PAUSED = "ALREADY_PAUSED",
  ALREADY_RUNNING = "ALREADY_RUNNING",
}

const reasonToStatusCodeMap: Record<ContainerErrorReason, HttpStatus> = {
  [ContainerErrorReason.CREATE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.REMOVE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.PAUSE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.UNPAUSE_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ContainerErrorReason.ALREADY_PAUSED]: HttpStatus.CONFLICT,
  [ContainerErrorReason.ALREADY_RUNNING]: HttpStatus.CONFLICT,
};

const reasonToMessageMap: Record<ContainerErrorReason, string> = {
  [ContainerErrorReason.CREATE_FAILED]: "Failed to create instance container.",

  [ContainerErrorReason.REMOVE_FAILED]: "Failed to remove instance container.",

  [ContainerErrorReason.PAUSE_FAILED]: "Failed to pause instance container.",

  [ContainerErrorReason.UNPAUSE_FAILED]: "Failed to resume instance container.",

  [ContainerErrorReason.ALREADY_PAUSED]: "Instance container is already paused.",

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
