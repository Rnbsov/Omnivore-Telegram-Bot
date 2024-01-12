export const graphqlEndpoint =
  'https://api-prod.omnivore.app/api/graphql'

export const SaveUrlQuery = `
  mutation SaveUrl($input: SaveUrlInput!) {
    saveUrl(input: $input) {
      ... on SaveSuccess {
        url
        clientRequestId
      }
      ... on SaveError {
        errorCodes
        message
      }
    }
  }
`

export const searchQuery = `
  query Search($term: String!, $after: String!) {
    search(query: $term, after: $after) {
      ... on SearchSuccess {
        edges {
          cursor
          node {
            id
            title
            description
            image
            url
          }
        }
        pageInfo {
          endCursor
          totalCount
        }
      }
      ... on SearchError {
        errorCodes
      }
    }
  }
`
