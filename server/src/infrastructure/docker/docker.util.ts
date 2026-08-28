import { InterfaceDockerApiError } from "./docker.type";

export function isDockerApiError(error: unknown): error is InterfaceDockerApiError {
  return typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number";
}

export function isNotFoundError(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 404;
}

export function isAlreadyPaused(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 409 && error.message.includes("is already paused");
}

export function isNotPaused(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 500 && error.message.includes("is not paused");
}
