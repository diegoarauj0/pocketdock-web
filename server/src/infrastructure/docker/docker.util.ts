import { InterfaceDockerApiError } from "./docker.type";

export function isDockerApiError(error: unknown): error is InterfaceDockerApiError {
  return typeof error === "object" && error !== null && "statusCode" in error && typeof error.statusCode === "number";
}

export function isNotFoundError(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 404;
}

export function isAlreadyStopped(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 304;
}

export function isAlreadyRunning(error: unknown): boolean {
  return isDockerApiError(error) && error.statusCode === 409 && error.message.includes("is already running");
}
