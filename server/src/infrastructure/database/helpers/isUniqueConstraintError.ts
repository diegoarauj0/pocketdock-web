import { QueryFailedError } from "typeorm";

const POSTGRES_UNIQUE_VIOLATION_CODE = "23505";

interface InterfacePostgresDriverError {
  code?: string;
  constraint?: string;
  detail?: string;
  table?: string;
}

export interface InterfaceUniqueConstraintViolation {
  constraint?: string;
  table?: string;
  columns: string[];
  values: string[];
}

function getDriverError(error: unknown): InterfacePostgresDriverError | null {
  if (!(error instanceof QueryFailedError)) {
    return null;
  }

  return (error.driverError as InterfacePostgresDriverError) ?? null;
}

export function isUniqueConstraintError(error: unknown): boolean {
  const driverError = getDriverError(error);
  return driverError?.code === POSTGRES_UNIQUE_VIOLATION_CODE;
}

export function parseUniqueConstraintViolation(error: unknown): InterfaceUniqueConstraintViolation | null {
  const driverError = getDriverError(error);

  if (!driverError || driverError.code !== POSTGRES_UNIQUE_VIOLATION_CODE) {
    return null;
  }

  const match = driverError.detail?.match(/Key \(([^)]+)\)=\(([^)]+)\)/);

  return {
    constraint: driverError.constraint,
    table: driverError.table,
    columns: match ? match[1].split(", ").map((c) => c.trim()) : [],
    values: match ? match[2].split(", ").map((v) => v.trim()) : [],
  };
}
