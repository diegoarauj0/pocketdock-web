import type { InterfaceInstanceLifecycleStatus } from "../services/instances.service";
import type { InterfaceTheme } from "@/features/theme/theme.type";

export const INSTANCE_STATUS_LABEL_KEYS = {
  pending: "INSTANCE_STATUS_PENDING",
  completed: "INSTANCE_STATUS_COMPLETED",
  failed: "INSTANCE_STATUS_FAILED",
} as const satisfies Record<InterfaceInstanceLifecycleStatus, string>;

export function resolveInstanceStatusColor(
  theme: InterfaceTheme,
  status: InterfaceInstanceLifecycleStatus,
): string {
  switch (status) {
    case "completed":
      return theme.success;
    case "failed":
      return theme.danger;
    default:
      return theme.warning;
  }
}
