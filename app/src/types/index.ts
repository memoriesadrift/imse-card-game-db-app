export type WebLink = string & {__type: 'URL'}

export type Username = string & {__type: 'Username'}

export type Verification = {
    comment: string,
    timestamp: number,
    verifiedByAdmin: string,
}

export type Review = {
    id: string,
    text: string,
    rating: number,
    timestamp: number,
    leftByUser: string,
}

export type PartialReview = {
    text: string,
    rating: number,
    leftByUser: string,
}

export type CardType = {
    id: string,
    name: string,
    wikipediaLink: WebLink,
}

export type CardGame = {
    id: string,
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
