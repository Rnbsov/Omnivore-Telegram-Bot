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
  query Search($term: String!, $after: String!, $first: Int!) {
    search(query: $term, after: $after, first: $first) {
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

export const uploadFileMutation = `
  mutation UploadFileRequest($input: UploadFileRequestInput!) {
    uploadFileRequest(input: $input) {
      ... on UploadFileRequestError {
        errorCodes
      }
      ... on UploadFileRequestSuccess {
        id
        uploadSignedUrl
        createdPageId
      }
    }
  }
`
