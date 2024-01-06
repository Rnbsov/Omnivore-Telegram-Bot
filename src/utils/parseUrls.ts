export function parseUrls(urls: string): string[] {
  const urlsArray = urls.split(/\r?\n/)

  return urlsArray
}
