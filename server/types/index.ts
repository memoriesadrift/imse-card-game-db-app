export type URL = string & {__type: 'URL'}

export type Verification = {
  comment: string,
  timestamp: number,
  verifiedByAdmin: string,
}

export type Review = {
  id?: number,
  text: string,
  rating: number,
  timestamp?: number,
  leftByUser: string,
}

export type CardType = {
  id: number,
  name: string,
  wikipediaLink: URL,
}

export type CardGame = {
  id?: number,
  name: string,
  cardType: CardType,
  description: string,
  reviews: Array<Review>,
  verification?: Verification,
}

export type ReportOne = {
  cardTypeName: string,
  reviewCount: number
}

export type ReportTwo = {
  cardGameName: string,
  userCount: number
}

export type User = {
  username: string // we do not need more than this for our usecase
}