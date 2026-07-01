export const SCENE_SUMMARY_MAX_LENGTH = 180;
export const SHORT_STATUS_MAX_LENGTH = 48;

export function compactText(value: string, maxLength: number): string {
  const compacted = value.replace(/\s+/g, " ").trim();
  if (!compacted) return compacted;
  if (compacted.length <= maxLength) return compacted;

  const clipped = compacted.slice(0, maxLength).trimEnd();
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 24 ? clipped.slice(0, lastSpace) : clipped).trim()}...`;
}
