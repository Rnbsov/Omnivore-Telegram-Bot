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

  async search(query: string, after?: string) {
    try {
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'a7858040-3d69-44cd-9c3b-6f333560da9b',
        },
        body: JSON.stringify({
          query: searchQuery,
          variables: {
            term: query,
            after,
          },
        }),
      })

      const data = await response.json()

      if (data.errors) {
        console.error('GraphQL request returned errors:', data.errors)
        return {
          results: [],
          nextOffset: '', // No next offset in case of errors
        }
      }

      const edges = data.data.search.edges
      const pageInfo = data.data.search.pageInfo

      if (edges && edges.length > 0) {
        // Process the data (e.g., log or display)
        console.log(edges)

        // Transform edges into InlineQueryResultArticle objects
        const results = edges.map((edge: any) => {
          return InlineQueryResultBuilder.article(
            edge.node.id,
            edge.node.title, {description: edge.node.description, thumbnail_url: edge.node.image, url: edge.node.url}
          ).text(edge.node.url)
        })

        // Determine the next offset based on pageInfo
        const nextOffset = pageInfo.hasNextPage
          ? pageInfo.endCursor
          : ''

        // Return the results and the next offset
        return {
          results,
          nextOffset,
        }
      } else {
        console.log('No data found for the given query.')
        return {
          results: [],
          nextOffset: '', // No results, so no next offset
        }
      }
    } catch (error) {
      console.error('GraphQL request failed:', error)
      return {
        results: [],
        nextOffset: '', // No results, so no next offset
      }
    }
  }
}
