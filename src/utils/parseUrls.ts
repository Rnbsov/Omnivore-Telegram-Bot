export function parseUrls(urls: string): string[] {
  const urlsArray = urls.split(/https?:\/\/\S+/)

  return urlsArray
}
