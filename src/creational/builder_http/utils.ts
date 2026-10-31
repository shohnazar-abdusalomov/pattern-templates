export function appendUri(uri: string, appendQuery: string): string {
  try {
    const url = new URL(uri);
    const existing = url.search ? url.search.substring(1) : '';
    url.search = existing ? `${existing}&${appendQuery}` : appendQuery;
    return url.toString();
  } catch {
    const separator = uri.includes('?') ? '&' : '?';
    return `${uri}${separator}${appendQuery}`;
  }
}

export function addParamsToUrl(
  url: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  let appendedUrl = url;
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      appendedUrl = appendUri(appendedUrl, `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return appendedUrl;
}
