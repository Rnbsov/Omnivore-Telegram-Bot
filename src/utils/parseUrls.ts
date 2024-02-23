export function parseUrls(urls: string): string[] {
  const regex = /(?:https?:\/\/|www\.)\S+?(?=\s|$)/g

  const urlsArray = urls.match(regex)

  return urlsArray || []
}
