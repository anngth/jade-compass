export const SCENE_SUMMARY_MAX_LENGTH = 180;
export const SHORT_STATUS_MAX_LENGTH = 48;

export function compactText(value: string, maxLength: number): string {
  const compacted = value.replace(/\s+/g, " ").trim();
  if (!compacted) return compacted;
  if (compacted.length <= maxLength) return compacted;
  if (maxLength <= 3) return compacted.slice(0, maxLength);

  const clipLimit = maxLength - 3;
  const clipped = compacted.slice(0, clipLimit).trimEnd();
  const lastSpace = clipped.lastIndexOf(" ");
  const trimmed =
    lastSpace > 24 ? clipped.slice(0, lastSpace).trimEnd() : clipped;
  return `${trimmed}...`;
}
