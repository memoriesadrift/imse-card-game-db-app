import { ObjectId, Timestamp } from "mongodb"

export type URL = string & {__type: 'URL'}

export type Verification = {
  comment: string,
  timestamp: Timestamp,
  verifiedByAdmin: string,
}

export type Review = {
  id?: number | ObjectId,
  cardGameId?: number | ObjectId,
  text: string,
  rating: number,
  timestamp?: number,
  leftByUser: string,
}

export type CardType = {
  id: number | ObjectId,
  name: string,
  wikipediaLink: URL,
}

export type CardGame = {
  id?: number | ObjectId,
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
  username: string,
  passwordHash: string,
  email: string,
  birthday: Date,
  favorites?: number[] | ObjectId[]
}