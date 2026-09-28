import type Docker from "dockerode";

export interface InterfaceContainerStatus {
  running: boolean;
  paused: boolean;
}

export interface InterfaceExecResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface InterfaceDockerApiError extends Error {
  json?: { message: string };
  statusCode: number;
}

export interface InterfaceBuildImageOptions {
  context: string;
  dockerfile?: string;
  tag: string;
  labels?: Record<string, string>;
  buildArgs?: Record<string, string>;
}

export interface InterfaceCreateContainerOptions {
  name: string;
  image: string;

  env?: string[];

  labels?: Record<string, string>;

  exposedPorts?: Record<string, Record<string, never>>;

  hostConfig?: Docker.HostConfig;

  networkingConfig?: Docker.ContainerCreateOptions["NetworkingConfig"];

  cmd?: string[];
}
