import type Docker from "dockerode";

export interface InterfaceContainerStatus {
  running: boolean;
  paused: boolean;
  status: string;
}

export interface InterfaceContainer {
  id: string;
}

export interface InterfaceContainerMemoryUsage {
  usedBytes: number;
  limitBytes: number;
}

export interface InterfaceContainerCpuUsage {
  totalUsage: number;
  previousTotalUsage: number;
  systemUsage: number;
  previousSystemUsage: number;
  onlineCpus: number;
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

interface InterfaceHostConfig {
  NanoCpus: number;
  Memory: number;
}

export interface InterfaceCreateContainerOptions {
  name: string;
  image: string;

  env?: string[];

  labels?: Record<string, string>;

  exposedPorts?: Record<string, Record<string, never>>;

  hostConfig?: InterfaceHostConfig;

  networkingConfig?: Docker.ContainerCreateOptions["NetworkingConfig"];

  cmd?: string[];
}
