const AVERAGE_WPM = 250;

export function readTime(text?: string | null): string {
  // Strip HTML tags (and MDX component tags) so only prose is counted
  const plainText = text ? text.replace(/<[^>]+>/g, "") : "";

  const wordCount = plainText.trim().split(/\s+/).length;
  const estimatedTime = Math.ceil(wordCount / AVERAGE_WPM);

  return estimatedTime > 1 ? `${estimatedTime} min` : "Less than 1 min";
}
