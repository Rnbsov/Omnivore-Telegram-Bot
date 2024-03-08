import { ParsedUrl } from './types.ts'

export function parseUrls(urls: string): ParsedUrl[] {
  const regex = /((?:https?:\/\/|www\.)[^ \n\r]+)(.*)/g

  let match
  const urlsArray = []

  while ((match = regex.exec(urls)) !== null) {
    const url = match[1].trim()
    const labels = match[2] ? match[2].trim().split(/\s+/) : []

    urlsArray.push({ url, labels })
  }

  return urlsArray || []
}
