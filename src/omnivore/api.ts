import {
  red,
  green,
} from 'https://deno.land/std@0.211.0/fmt/colors.ts'

import {
  SaveUrlQuery,
  graphqlEndpoint,
  searchQuery,
} from './graphql.ts'
import { InlineQueryResultBuilder } from 'https://deno.land/x/grammy@v1.20.3/mod.ts'
import { UrlInfo } from "../utils/types.ts";

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

  async saveUrl(url: string, labels: string[]) {
    const variables = {
      input: {
        clientRequestId: globalThis.crypto.randomUUID(),
        source: 'api',
        url,
        labels
      },
    }

    const requestBody = {
      query: SaveUrlQuery,
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

  async processUrls(urls: UrlInfo[], startIndex = 0) {
    const batchSize = 50
    const remainingUrls = urls.slice(startIndex)

    for (let i = 0; i <= batchSize && i < remainingUrls.length; i++) {
      const url = remainingUrls[i].url
      const urlLabels = remainingUrls[i].labels
      await this.saveUrl(url, urlLabels)
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

  async search(query: string, after?: string) {
    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.apiToken,
        },
        body: JSON.stringify({
          query: searchQuery,
          variables: {
            term: query,
            after,
            first: 3
          },
        }),
      })

      const data = await response.json()
      console.log("🚀 ~ OmnivoreApi ~ search ~ data:", data)

      if (data.errors) {
        console.error('GraphQL request returned errors:', data.errors)
        return {
          results: [],
          nextOffset: ''
        }
      }

      const edges = data.data.search.edges
      const pageInfo = data.data.search.pageInfo

      if (edges && edges.length > 0) {
        // Transform edges into InlineQueryResultArticle objects
        const results = edges.map((edge: any) => {
          return InlineQueryResultBuilder.article(
            edge.node.id,
            edge.node.title, {description: edge.node.description, thumbnail_url: edge.node.image, url: edge.node.url}
          ).text(edge.node.url)
        })

        // Return the results
        return {
          results,
          nextOffset: pageInfo.endCursor
        }
      } else {
        console.log('No data found for the given query.')
        return {
          results: [],
          nextOffset: ''
        }
      }
    } catch (error) {
      console.error('GraphQL request failed:', error)
      return {
        results: [],
        nextOffset: ''
      }
    }
  }
}
