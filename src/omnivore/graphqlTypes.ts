import { InlineQueryResultArticle } from "https://deno.land/x/grammy_types@v3.4.6/inline.ts";

interface LinkShareInfo {
  title: string
  description: string
  imageUrl: string
}

interface ArticleHighlightsInput {
  includeFriends: boolean
}

interface Article {
  id: string
  title: string
  slug: string
  url: string
  hash: string
  content: string
  pageType?: PageType
  contentReader: ContentReader
  hasContent: boolean
  author?: string
  image?: string
  description?: string
  originalHtml?: string
  createdAt: Date
  savedAt: Date
  updatedAt?: Date
  publishedAt?: Date
  readingProgressTopPercent?: number
  readingProgressPercent: number
  readingProgressAnchorIndex: number
  sharedComment?: string
  savedByViewer: boolean
  postedByViewer: boolean
  originalArticleUrl?: string
  highlights(input?: ArticleHighlightsInput): Highlight[]
  shareInfo?: LinkShareInfo
  isArchived: boolean
  linkId?: string
  labels?: Label[]
  uploadFileId?: string
  siteName?: string
  siteIcon?: string
  subscription?: string
  unsubMailTo?: string
  unsubHttpUrl?: string
  state?: ArticleSavingRequestStatus
  language?: string
  readAt?: Date
  recommendations?: Recommendation[]
  wordsCount?: number
  folder: string
}

enum ReactionType {
  LIKE = 'LIKE',
  HEART = 'HEART',
  SMILE = 'SMILE',
  HUSHED = 'HUSHED',
  CRYING = 'CRYING',
  POUT = 'POUT',
}

interface Profile {
  id: string
  username: string
  private: boolean
  bio?: string
  pictureUrl?: string
}

interface FeedArticle {
  id: string
  article: Article
  sharedBy: User
  sharedAt: Date
  sharedComment?: string
  sharedWithHighlights: boolean
  highlightsCount: number
  annotationsCount: number
  highlight?: Highlight
  reactions: Reaction[]
}

interface RecommendingUser {
  userId: string
  name: string
  username: string
  profileImageURL?: string
}

enum HighlightType {
  HIGHLIGHT = 'HIGHLIGHT',
  REDACTION = 'REDACTION',
  NOTE = 'NOTE',
}

interface Reaction {
  id: string
  user: User
  code: ReactionType
  createdAt: Date
  updatedAt?: Date
}

interface HighlightReply {
  id: string
  user: User
  highlight: Highlight
  text: string
  createdAt: Date
  updatedAt?: Date
}

interface User {
  id: string
  name: string
  isFullUser: boolean
  viewerIsFollowing: boolean
  isFriend: boolean
  picture?: string // Temporary; same as profile.pictureUrl for backward compatibility purposes
  profile: Profile
  sharedArticles: FeedArticle[]
  sharedArticlesCount: number
  sharedHighlightsCount: number
  sharedNotesCount: number
  friendsCount: number
  followersCount: number
  email?: string
  source?: string
  intercomHash?: string
}

enum PageType {
  ARTICLE = 'ARTICLE',
  BOOK = 'BOOK',
  FILE = 'FILE',
  PROFILE = 'PROFILE',
  WEBSITE = 'WEBSITE',
  HIGHLIGHTS = 'HIGHLIGHTS',
  UNKNOWN = 'UNKNOWN',
  TWEET = 'TWEET',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
}

enum ContentReader {
  WEB = 'WEB',
  PDF = 'PDF',
  EPUB = 'EPUB',
}

interface Label {
  id: string
  name: string
  color: string
  description?: string
  createdAt?: Date
  position?: number
  internal?: boolean
  source?: string
}

enum ArticleSavingRequestStatus {
  PROCESSING,
  SUCCEEDED,
  FAILED,
  DELETED,
  ARCHIVED,
  CONTENT_NOT_FETCHED,
}

interface Highlight {
  id: string
  shortId: string
  user: User
  quote: string
  prefix?: string
  suffix?: string
  patch?: string
  annotation: string
  replies: HighlightReply[]
  sharedAt?: Date
  createdAt: Date
  updatedAt?: Date
  reactions: Reaction[]
  createdByMe: boolean
  highlightPositionPercent?: number
  highlightPositionAnchorIndex?: number
  labels: Label[]
  type: HighlightType
  html?: string
  color: string
}

interface Recommendation {
  id: string
  name: string
  user: RecommendingUser
  recommendedAt: Date
  note: string
}

// Search types
export interface SearchItem {
  id: string
  title: string
  slug: string
  url: string
  pageType: PageType
  contentReader: ContentReader
  createdAt: Date
  updatedAt?: Date
  isArchived: boolean
  readingProgressTopPercent?: number
  readingProgressPercent: number
  readingProgressAnchorIndex: number
  author?: string
  image?: string
  description?: string
  publishedAt?: Date
  ownedByViewer: boolean
  originalArticleUrl?: string
  uploadFileId?: string
  pageId?: string
  shortId?: string
  quote?: string
  annotation?: string
  color?: string
  labels?: Label[]
  subscription?: string
  unsubMailTo?: string
  unsubHttpUrl?: string
  state?: ArticleSavingRequestStatus
  siteName?: string
  language?: string
  readAt?: Date
  savedAt: Date
  highlights?: Highlight[]
  siteIcon?: string
  recommendations?: Recommendation[]
  wordsCount?: number
  content?: string
  archivedAt?: Date
  previewContent?: string
  previewContentType?: string
  links?: JSON
  folder: string
}

interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
  totalCount?: number
}

enum SearchErrorCode {
  UNAUTHORIZED,
  QUERY_TOO_LONG,
}

export interface SearchItemEdge {
  cursor: string
  node: SearchItem
}

export interface SearchSuccess {
  edges: SearchItemEdge[]
  pageInfo: PageInfo
}

export interface SearchError {
  errorCodes: SearchErrorCode[]
}

export type SearchResult = SearchSuccess | SearchError

export interface SearchRequestResponse {
  errors: SearchError
  data: {
    search: SearchSuccess
  }
}

export interface SearchReturn {
  results: InlineQueryResultArticle[]
  nextOffset: string
}
