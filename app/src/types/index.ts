export type WebLink = string & {__type: 'URL'}

export type Verification = {
    comment: string,
    timestamp: number,
    verifiedByAdmin: string,
}

export type Review = {
    id: number,
    text: string,
    rating: number,
    timestamp: number,
    leftByUser: string,
}

export type CardType = {
    id: number,
    name: string,
    wikipediaLink: WebLink,
}

export type CardGame = {
    id: number,
    name: string,
    cardType: CardType,
    description: string,
    reviews: Array<Review>,
    verification?: Verification,
}
