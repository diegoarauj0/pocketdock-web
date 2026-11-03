const USER_AGENT_MAX_LENGTH = 120;

export function truncateUserAgent(userAgent: string | null): string | null {
  if (userAgent === null) return null;
  if (userAgent.length <= USER_AGENT_MAX_LENGTH) return userAgent;

  return `${userAgent.slice(0, USER_AGENT_MAX_LENGTH - 3)}...`;
}
