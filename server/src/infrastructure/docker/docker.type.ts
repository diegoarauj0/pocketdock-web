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
