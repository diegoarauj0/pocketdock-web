export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (domain === undefined) return "***";

  const visibleLength = Math.min(2, Math.max(0, localPart.length - 1));
  const visiblePart = localPart.slice(0, visibleLength);
  const hiddenLength = Math.max(1, localPart.length - visibleLength);

  return `${visiblePart}${"*".repeat(hiddenLength)}@${domain}`;
}
