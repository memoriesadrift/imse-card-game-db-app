import { CardType, Review, WebLink, Verification, CardGame, Username, PartialReview } from "../types"

export const parseCardType = (json: any) => {
    const cardType: CardType = {
        name: json.name,
        id: json.id,
        wikipediaLink: json.wikipediaLink as WebLink,
    }

    return cardType
}

export const parseCardGame = (json: any) =>  {
    const baseObj = {
        id: json.id,
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
                id: rawReview.id,
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

export const extractUsername = (rawUser: any) => {
    return rawUser.username as Username
}
export const cardTypeToJSONString = (cardType: CardType) => JSON.stringify(cardType)
export const cardTypeFromJSONString = (value: string) => JSON.parse(value) as CardType

export const buildNewCardGameObject = (name: string, description: string, cardType: CardType, id?: string): CardGame => {
    return {
        ...{name, description, cardType},
        id: id || '',
        reviews: [],
    }
}

export const buildNewPartialReviewObject = (rating: number, text: string, leftByUser: Username): PartialReview => {
    return {...{text, rating, leftByUser}}
}
