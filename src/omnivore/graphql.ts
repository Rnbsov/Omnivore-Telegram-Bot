export const graphqlEndpoint = 'https://api-prod.omnivore.app/api/graphql'

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