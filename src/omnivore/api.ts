import {
  red,
  green,
} from 'https://deno.land/std@0.211.0/fmt/colors.ts'

import { SaveUrlQuery, graphqlEndpoint } from './graphql.ts'

interface OmnivoreApiInterface {
  apiToken: string
  addedEntriesCount: number
  failedEntriesCount: number
  failedEntries: string[]
}

export class OmnivoreApi implements OmnivoreApiInterface {
  apiToken: string
  static delayBetweenRequests = 3000
  addedEntriesCount = 0
  failedEntriesCount = 0
  failedEntries: string[] = []

  constructor(apiToken: string) {
    this.apiToken = apiToken
  }

  async saveUrl(url: string) {
    const variables = {
      input: {
        clientRequestId: globalThis.crypto.randomUUID(),
        source: 'api',
        url,
      },
    }

    const requestBody = {
      SaveUrlQuery,
      variables,
    }

    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.apiToken,
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const { url: successUrl } = data.data.saveUrl

      if (successUrl) {
        this.addedEntriesCount++
        console.log('Response for', url, ':', data)
      } else {
        console.log(red('Failed entry:'), url)
        this.failedEntries.push(url)
        this.failedEntriesCount++
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async processUrls(urls: string[], startIndex = 0) {
    const batchSize = 50
    const remainingUrls = urls.slice(startIndex)

    for (let i = 0; i <= batchSize && i < remainingUrls.length; i++) {
      const url = remainingUrls[i]
      await this.saveUrl(url)
    }

    const nextIndex = startIndex + batchSize + 1
    if (nextIndex < urls.length) {
      console.log(green('wait 3 seconds'))
      await new Promise(resolve =>
        setTimeout(resolve, OmnivoreApi.delayBetweenRequests)
      )
      await this.processUrls(urls, nextIndex)
    }
  }
}
