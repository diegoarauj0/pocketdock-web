export function truncateIpAddress(ipAddress: string | null): string | null {
  if (ipAddress === null || ipAddress.length === 0) return null;

  const ipv4Candidate = ipAddress.includes(":") ? ipAddress.split(":").pop() : ipAddress;

  if (ipv4Candidate !== undefined && ipv4Candidate.includes(".")) {
    const parts = ipv4Candidate.split(".");

    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }

  if (!ipAddress.includes(":")) return "***";

  const [head] = ipAddress.split("::");
  const headSegments = head.split(":").filter((segment) => segment.length > 0);

  if (headSegments.length === 0) return "***";

  return `${headSegments.slice(0, 4).join(":")}::`;
}
