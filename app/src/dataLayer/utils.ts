import { CardType, Review, WebLink, Verification, CardGame } from "../types"

export const parseCardType = (json: any) => {
    const cardType: {cardType: CardType} = {
        cardType: {
            name: json.name,
            id: json.id,
            wikipediaLink: json.wikipediaLink as WebLink,
        }
    }

    return cardType
}

export const parseCardGame = (json: any) =>  {
    const baseObj = {
        id: parseInt(json.id),
        name: json.name,
        description: json.description,
    }

    const cardType: {cardType: CardType} = {
        cardType: {
            name: json.cardType.name,
            id: json.cardType.id,
            wikipediaLink: json.cardType.wikipediaLink as WebLink,
        }
    }

    const reviews: {reviews: Array<Review>} = {
        reviews: json.reviews.map((rawReview: any): Review => {
            return {
                id: parseInt(rawReview.id),
                text: rawReview.text,
                rating: parseInt(rawReview.rating),
                timestamp: parseInt(rawReview.timestamp),
                leftByUser: rawReview.leftByUser,
            }
        }),
    }

    const verification: {verification?: Verification} = json.verification ? {
        verification: {
            comment: json.verification.comment,
            timestamp: parseInt(json.verification.timestamp),
            verifiedByAdmin: json.verification.verifiedByAdmin,
        },
    } : {}

    return {...baseObj, ...cardType, ...reviews, ...verification}
}

// TODO: implement
export const cardTypeFromName = (name: string): CardType => { return {
      id: 1,
      name: 'French-suited playing cards',
      wikipediaLink: 'https://en.wikipedia.org/wiki/French-suited_playing_cards' as WebLink,
}}

export const buildNewCardGameObject = (name: string, description: string, cardType: CardType): CardGame => {
    return {
        ...{name, description, cardType},
        id: -1, // discarded by server
        reviews: [],
    }
}
