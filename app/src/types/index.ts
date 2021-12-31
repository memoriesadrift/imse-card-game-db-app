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

export type CardGame = {
    id: number,
    name: string,
    description: string,
    reviews: Array<Review>,
    verification?: Verification,
}
